import React, { Component } from "react";
import {
  Badge,
  Card,
  CardHeader,
  CardFooter,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  Pagination,
  PaginationItem,
  PaginationLink,
  Table,
  Container,
  Row,
  Button,
  Spinner,
} from "reactstrap";
import Header from "./../components/Headers/Header.js";
import customerService from "./../services/customerService";
import alertService from "../services/alertService";
import toastService from "../services/toastService";
import authService from "../services/authService";

class CustomerTable extends Component {
  state = {
    customers: [],
    dataLoaded: false,
  };

  userRole = authService.getCurrentRole();

  async componentDidMount() {
    this.setState({ dataLoaded: false });
    try {
      const { data: response } = await customerService.getCustomers();
      if (response.data.customers) {
        let customers = [];
        response.data.customers.forEach((item, index) => {
          if (this.userRole.role === "admin") {
            console.log(item);
            customers.push(item);
          } else if (
            this.userRole.role === "tenant" &&
            this.userRole.tenantId === item.dealer.franchise.tenantId
          ) {
            customers.push(item);
          } else if (
            this.userRole.role === "franchise" &&
            this.userRole.tenantId === item.dealer.franchise.tenantId &&
            this.userRole.franchiseId === item.dealer.franchiseId
          ) {
            customers.push(item);
          } else if (
            this.userRole.role === "dealer" &&
            this.userRole.tenantId === item.dealer.franchise.tenantId &&
            this.userRole.franchiseId === item.dealer.franchiseId &&
            this.userRole.dealerId === item.dealerId
          ) {
            customers.push(item);
          }
        });
        this.setState({ customers: customers });
      }
    } catch (ex) {
      toastService.error(ex.message);
    }
    this.setState({ dataLoaded: true });
  }

  handleAdd = () => {
    this.props.history.push("/dashboard/customers/add");
  };

  handleAddSubscription = (customer) => {
    try {
      alertService
        .show({
          title: "Are you sure?",
          text: `Do you want Activate Subscription Customer "${customer.name}"`,
          icon: "info",
          buttons: true,
          dangerMode: false,
        })
        .then((addSubscription) => {
          if (addSubscription) {
            customerService
              .addCustomerSubscription(customer.id)
              .then((response) => {
                console.log(response.data.data);
                let customers = this.state.customers.map((c) =>
                  customer.id === c.id
                    ? {
                        ...c,
                        customer_subscriptions: [
                          response.data.data.customerSubscription,
                        ],
                      }
                    : c
                );
                this.setState({ customers });
                toastService.info(response.data.data.status);
              })
              .catch((ex) => {
                toastService.error(ex.message);
              });
          }
        });
    } catch (ex) {
      toastService.error(ex.message);
    }
  };

  handleDeleteSubscription = (customer) => {
    try {
      alertService
        .show({
          title: "Are you sure?",
          text: `Do you want Cancel Subscription Customer "${customer.name}"`,
          icon: "danger",
          buttons: true,
          dangerMode: true,
        })
        .then((addSubscription) => {
          if (addSubscription) {
            customerService
              .deleteCustomerSubscription(
                customer.id,
                customer.customer_subscriptions[0].id
              )
              .then((response) => {
                let customers = this.state.customers.map((c) =>
                  customer.id === c.id
                    ? { ...c, customer_subscriptions: [] }
                    : c
                );
                this.setState({ customers });
                toastService.info(response.data.data.status);
              })
              .catch((ex) => {
                toastService.error(ex.message);
              });
          }
        });
    } catch (ex) {
      toastService.error(ex.message);
    }
  };

  handleEdit = (customer) => {
    this.props.history.push(`/dashboard/customers/${customer.id}/edit`);
  };

  handleDelete = (customer) => {
    try {
      alertService
        .show({
          title: "Are you sure?",
          text: `Do you want to delete Customer "${customer.name}"`,
          icon: "warning",
          buttons: true,
          dangerMode: true,
        })
        .then((willDelete) => {
          if (willDelete) {
            let response = customerService.deleteCustomer(customer.id);
            response
              .then((res) => {
                const customers = this.state.customers.filter(
                  (c) => c.id !== res.data.data.customer.id
                );
                this.setState({ customers: customers });
              })
              .catch((ex) => {
                toastService.error(ex.message);
              });
          }
        });
    } catch (ex) {
      toastService.error(ex.message);
    }
  };

  render() {
    return (
      <>
        <Header />
        <Container className="mt--7" fluid>
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <Row className="align-items-center">
                    <div className="col">
                      <h3 className="mb-0">Customers</h3>
                    </div>
                    <div className="col text-right">
                      <Button
                        color="primary"
                        onClick={(e) => {
                          e.preventDefault();
                          this.handleAdd();
                        }}
                        size="sm"
                      >
                        Add
                      </Button>
                    </div>
                  </Row>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Name</th>
                      <th scope="col">Dealer</th>
                      <th scope="col">Franchise</th>
                      <th scope="col">Company</th>
                      <th scope="col">Username</th>
                      <th scope="col">Connection Type</th>
                      <th scope="col">Subscription</th>
                      <th scope="col" />
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.customers &&
                      this.state.customers.map((item) => (
                        <tr key={item.id}>
                          <th scope="row">
                            <Media className="align-items-center">
                              <Media>
                                <span className="mb-0 text-sm">
                                  {item.name}
                                </span>
                              </Media>
                            </Media>
                          </th>
                          <td>{item.dealer.name}</td>
                          <td>{item.dealer.franchise.name}</td>
                          <td>{item.dealer.franchise.tenant.companyName}</td>
                          <td>{item.userName}</td>
                          <td>{item.connectionType}</td>
                          <td>
                            {item.customer_subscriptions.length > 0 ? (
                              <p cl>Activated</p>
                            ) : (
                              <Button
                                color="primary"
                                onClick={(e) => {
                                  e.preventDefault();
                                  this.handleAddSubscription(item);
                                }}
                                size="sm"
                              >
                                Activate
                              </Button>
                            )}
                            {/* 
                            <Button
                              color="danger"
                              onClick={(e) => {
                                e.preventDefault();
                                this.handleDeleteSubscription(item);
                              }}
                              size="sm"
                              disabled={
                                item.customer_subscriptions.length === 0
                              }
                            >
                              Delete
                            </Button> */}
                          </td>
                          <td className="text-right">
                            <UncontrolledDropdown>
                              <DropdownToggle
                                className="btn-icon-only text-light"
                                role="button"
                                size="sm"
                                color=""
                                onClick={(e) => e.preventDefault()}
                              >
                                <i className="fas fa-ellipsis-v" />
                              </DropdownToggle>
                              <DropdownMenu
                                className="dropdown-menu-arrow"
                                right
                              >
                                <DropdownItem
                                  onClick={(e) => {
                                    e.preventDefault();
                                    this.handleEdit(item);
                                  }}
                                >
                                  Edit
                                </DropdownItem>
                                <DropdownItem
                                  onClick={(e) => {
                                    e.preventDefault();
                                    this.handleDelete(item);
                                  }}
                                >
                                  Delete
                                </DropdownItem>
                              </DropdownMenu>
                            </UncontrolledDropdown>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
                {!this.state.dataLoaded && (
                  <div className="text-center m-5">
                    <Spinner type="grow" color="primary" />
                  </div>
                )}
                {this.state.dataLoaded && this.state.customers.length < 1 && (
                  <div className="text-center m-5">
                    <p>No data to show </p>
                  </div>
                )}
                <CardFooter className="py-4">
                  <nav aria-label="...">
                    <Pagination
                      className="pagination justify-content-end mb-0"
                      listClassName="justify-content-end mb-0"
                    >
                      <PaginationItem className="disabled">
                        <PaginationLink
                          href="#pablo"
                          onClick={(e) => e.preventDefault()}
                          tabIndex="-1"
                        >
                          <i className="fas fa-angle-left" />
                          <span className="sr-only">Previous</span>
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem className="active">
                        <PaginationLink
                          href="#pablo"
                          onClick={(e) => e.preventDefault()}
                        >
                          1
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem className="disabled">
                        <PaginationLink
                          href="#pablo"
                          onClick={(e) => e.preventDefault()}
                        >
                          <i className="fas fa-angle-right" />
                          <span className="sr-only">Next</span>
                        </PaginationLink>
                      </PaginationItem>
                    </Pagination>
                  </nav>
                </CardFooter>
              </Card>
            </div>
          </Row>
        </Container>
      </>
    );
  }
}

export default CustomerTable;
