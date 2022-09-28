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
import billingService from "./../services/billingService";
import alertService from "../services/alertService";
import toastService from "../services/toastService";
import authService from "../services/authService";

class BillingTable extends Component {
  state = {
    billings: [],
    dataLoaded: false,
  };

  userRole = authService.getCurrentRole();

  async componentDidMount() {
    this.setState({ dataLoaded: false });
    try {
      const { data: response } = await billingService.getBillings();
      console.log(response);
      if (response.data.billings) {
        let billings = [];
        console.log("billing", response);
        console.log("tenant", this.userRole.tenantId);
        response.data.billings.forEach((item, index) => {
          if (this.userRole.role === "admin") {
            billings.push(item);
          } else if (
            (this.userRole.role =
              "franchise" && this.userRole.franchiseId === item.franchiseId)
          ) {
            billings.push(item);
          } else if (
            (this.userRole.role =
              "tenant" &&
              this.userRole.tenantId === item.dealer.franchise.tenantId)
          ) {
            billings.push(item);
          }
        });
        this.setState({ billings: billings });
      }
    } catch (ex) {
      toastService.error(ex.message);
    }
    this.setState({ dataLoaded: true });
  }
  handleEdit = (billing) => {
    this.props.history.push(`/dashboard/billings/${billing.id}/edit`);
  };
  handleAdd = () => {
    this.props.history.push("/dashboard/billings/add");
  };

  handleDelete = (billing) => {
    try {
      alertService
        .show({
          title: "Are you sure?",
          text: `Do you want to delete Billing "${billing.amount}"`,
          icon: "warning",
          buttons: true,
          dangerMode: true,
        })
        .then((willDelete) => {
          if (willDelete) {
            let response = billingService.deleteBilling(billing.id);
            response
              .then((res) => {
                const billings = this.state.billings.filter(
                  (b) => b.id !== res.data.data.billing.id
                );
                this.setState({ billings: billings });
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
                      <h3 className="mb-0">Billings</h3>
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
                      <th scope="col">Dealer</th>
                      <th scope="col">franchise</th>
                      <th scope="col">User</th>
                      <th scope="col">Amount</th>
                      <th scope="col" />
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.billings &&
                      this.state.billings.map((item) => (
                        <tr key={item.id}>
                          {/* <th scope="row">
                            <Media className="align-items-center">
                              <Media>
                                <span className="mb-0 text-sm">
                                  {item.name}
                                </span>
                              </Media>
                            </Media>
                          </th> */}
                          <td>{item.dealer.name}</td>
                          <td>{item.dealer.franchise.name}</td>
                          <td>
                            {item.user.firstName} {item.user.lastName}
                          </td>
                          <td>{item.amount}</td>
                          {/* <td>
                            <Button
                              color="primary"
                              onClick={(e) => {
                                e.preventDefault();
                                this.handleAddSubscription(item);
                              }}
                              size="sm"
                            >
                              {item.customer_subscriptions.length > 0
                                ? "Renew"
                                : " Add "}
                            </Button> */}
                          {/* <Button
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
                            </Button>
                          </td> */}
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
                {this.state.dataLoaded && this.state.billings.length < 1 && (
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

export default BillingTable;
