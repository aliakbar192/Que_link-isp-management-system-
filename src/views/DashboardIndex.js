import React, { Component } from "react";

import Header from "../components/Headers/Header.js";
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Row,
  Spinner,
} from "reactstrap";
import authService from "../services/authService";
import dealerService from "../services/dealerService";
import franchiseService from "../services/franchiseService";
import tenantService from "../services/tenantService";
import adminService from "../services/adminService";
import billingService from "../services/billingService.js";
import _ from "lodash";
class Dashboard extends Component {
  state = {
    dataLoaded: true,

    data: {},
    balance: "",
    customer: "",
  };

  userRole = authService.getCurrentRole();

  async componentDidMount() {
    if (this.userRole.role === "admin") {
      const { data: response } = await adminService.getAdmin(1);
      console.log(response.data);
      if (response.data.admin) {
        console.log(response.data.admin);
        this.setState({ data: response.data.admin, dataLoaded: true });
      }
    } else if (this.userRole.role === "tenant") {
      const { data: response } = await tenantService.getTenant(
        this.userRole.tenantId
      );
      if (response.data.tenant) {
        console.log(response.data.tenant);
        this.setState({ data: response.data.tenant, dataLoaded: true });
      }
    } else if (this.userRole.role === "franchise") {
      const { data: response } = await franchiseService.getFranchise(
        this.userRole.franchiseId
      );
      if (response.data.franchise) {
        this.setState({ data: response.data.franchise, dataLoaded: true });
      }
    } else if (this.userRole.role === "dealer") {
      const { data: response } = await dealerService.getDealer(
        this.userRole.dealerId
      );
      if (response.data.dealer) {
        this.setState({ data: response.data.dealer, dataLoaded: true });
      }
      const { data: responseBilling } = await billingService.getBillings();
      if (responseBilling.data.billings) {
        responseBilling.data.billings.forEach((item, index) => {
          if (this.userRole.dealerId === item.dealerId) {
            this.setState({ balance: item.amount, dataLoaded: true });
          }
        });
      }
    } else {
    }
    console.log("balance", this.state.balance);
  }

  render() {
    return (
      <>
        <Header />
        <Container className="mt--7" fluid>
          {this.state.dataLoaded &&
            ["admin", "tenant", "franchise"].filter(
              (role) => role === this.userRole.role
            ).length > 0 && (
              <Row>
                <Container fluid>
                  <div className="header-body">
                    <Row>
                      <Col lg="6" xl="3">
                        <Card className="card-stats mb-4 mb-xl-0">
                          <CardBody>
                            <Row>
                              <div className="col">
                                <CardTitle
                                  tag="h5"
                                  className="text-uppercase text-muted mb-0"
                                >
                                  Tenant
                                </CardTitle>
                                <span className="h2 font-weight-bold mb-0">
                                  {(this.userRole.role === "admin" &&
                                    this.state.data.tenants) ||
                                    (this.userRole.role === "tenant" &&
                                      this.state.data.companyName) ||
                                    (this.userRole.role === "franchise" &&
                                      this.state.data.tenant &&
                                      this.state.data.tenant.companyName) ||
                                    "---"}
                                </span>
                              </div>
                              <Col className="col-auto">
                                <div className="icon icon-shape bg-red text-white rounded-circle shadow">
                                  <i className="ni ni-building" />
                                </div>
                              </Col>
                            </Row>
                          </CardBody>
                        </Card>
                      </Col>
                      <Col lg="6" xl="3">
                        <Card className="card-stats mb-4 mb-xl-0">
                          <CardBody>
                            <Row>
                              <div className="col">
                                <CardTitle
                                  tag="h5"
                                  className="text-uppercase text-muted mb-0"
                                >
                                  Franchise
                                </CardTitle>
                                <span className="h2 font-weight-bold mb-0">
                                  {(this.userRole.role === "admin" &&
                                    this.state.data.franchises) ||
                                    (this.userRole.role === "tenant" &&
                                      this.state.data.franchises) ||
                                    (this.userRole.role === "franchise" &&
                                      this.state.data.name) ||
                                    "---"}
                                </span>
                              </div>
                              <Col className="col-auto">
                                <div className="icon icon-shape bg-green text-white rounded-circle shadow">
                                  <i className="ni ni-shop" />
                                </div>
                              </Col>
                            </Row>
                          </CardBody>
                        </Card>
                      </Col>
                      <Col lg="6" xl="3">
                        <Card className="card-stats mb-4 mb-xl-0">
                          <CardBody>
                            <Row>
                              <div className="col">
                                <CardTitle
                                  tag="h5"
                                  className="text-uppercase text-muted mb-0"
                                >
                                  Dealer
                                </CardTitle>
                                <span className="h2 font-weight-bold mb-0">
                                  {(this.userRole.role === "admin" &&
                                    this.state.data.dealers) ||
                                    (this.userRole.role === "tenant" &&
                                      this.state.data.dealers) ||
                                    (this.userRole.role === "franchise" &&
                                      this.state.data.dealers) ||
                                    "---"}
                                </span>
                              </div>
                              <Col className="col-auto">
                                <div className="icon icon-shape bg-orange text-white rounded-circle shadow">
                                  <i className="ni ni-badge" />
                                </div>
                              </Col>
                            </Row>
                          </CardBody>
                        </Card>
                      </Col>
                      <Col lg="6" xl="3">
                        <Card className="card-stats mb-4 mb-xl-0">
                          <CardBody>
                            <Row>
                              <div className="col">
                                <CardTitle
                                  tag="h5"
                                  className="text-uppercase text-muted mb-0"
                                >
                                  Customer
                                </CardTitle>
                                <span className="h2 font-weight-bold mb-0">
                                  {(this.userRole.role === "admin" &&
                                    this.state.data.customers) ||
                                    (this.userRole.role === "tenant" &&
                                      this.state.data.customers - 1) ||
                                    (this.userRole.role === "franchise" &&
                                      this.state.data.customers) ||
                                    "---"}
                                </span>
                              </div>
                              <Col className="col-auto">
                                <div className="icon icon-shape bg-yellow text-white rounded-circle shadow">
                                  <i className="ni ni-bullet-list-67" />
                                </div>
                              </Col>
                            </Row>
                          </CardBody>
                        </Card>
                      </Col>
                    </Row>
                  </div>
                </Container>
              </Row>
            )}

          {this.state.dataLoaded &&
            ["dealer"].filter((role) => role === this.userRole.role).length >
              0 && (
              <Row>
                <Container fluid>
                  <div className="header-body">
                    <Row>
                      <Col lg="6" xl="3">
                        <Card className="card-stats mb-4 mb-xl-0">
                          <CardBody>
                            <Row>
                              <div className="col">
                                <CardTitle
                                  tag="h5"
                                  className="text-uppercase text-muted mb-0"
                                >
                                  Tenant
                                </CardTitle>
                                <span className="h2 font-weight-bold mb-0">
                                  {(this.userRole.role === "dealer" &&
                                    this.state.data.franchise &&
                                    this.state.data.franchise.tenant &&
                                    this.state.data.franchise.tenant
                                      .companyName) ||
                                    "---"}
                                </span>
                              </div>
                              <Col className="col-auto">
                                <div className="icon icon-shape bg-red text-white rounded-circle shadow">
                                  <i className="ni ni-building" />
                                </div>
                              </Col>
                            </Row>
                          </CardBody>
                        </Card>
                      </Col>
                      <Col lg="6" xl="3">
                        <Card className="card-stats mb-4 mb-xl-0">
                          <CardBody>
                            <Row>
                              <div className="col">
                                <CardTitle
                                  tag="h5"
                                  className="text-uppercase text-muted mb-0"
                                >
                                  Franchise
                                </CardTitle>
                                <span className="h2 font-weight-bold mb-0">
                                  {(this.userRole.role === "dealer" &&
                                    this.state.data.franchise &&
                                    this.state.data.franchise.name) ||
                                    this.state.data.franchise ||
                                    "---"}
                                </span>
                              </div>
                              <Col className="col-auto">
                                <div className="icon icon-shape bg-green text-white rounded-circle shadow">
                                  <i className="ni ni-shop" />
                                </div>
                              </Col>
                            </Row>
                          </CardBody>
                        </Card>
                      </Col>
                      <Col lg="6" xl="3">
                        <Card className="card-stats mb-4 mb-xl-0">
                          <CardBody>
                            <Row>
                              <div className="col">
                                <CardTitle
                                  tag="h5"
                                  className="text-uppercase text-muted mb-0"
                                >
                                  Balance
                                  {console.log("balance", this.state.balance)}
                                </CardTitle>
                                <span className="h2 font-weight-bold mb-0">
                                  {(this.userRole.role === "dealer" &&
                                    this.state.balance) ||
                                    "---"}
                                </span>
                              </div>
                              <Col className="col-auto">
                                <div className="icon icon-shape bg-orange text-white rounded-circle shadow">
                                  <i className="ni ni-badge" />
                                </div>
                              </Col>
                            </Row>
                          </CardBody>
                        </Card>
                      </Col>
                      <Col lg="6" xl="3">
                        <Card className="card-stats mb-4 mb-xl-0">
                          <CardBody>
                            <Row>
                              <div className="col">
                                <CardTitle
                                  tag="h5"
                                  className="text-uppercase text-muted mb-0"
                                >
                                  Customer
                                </CardTitle>
                                <span className="h2 font-weight-bold mb-0">
                                  {(this.userRole.role === "dealer" &&
                                    this.state.data.customers) ||
                                    "---"}
                                </span>
                              </div>
                              <Col className="col-auto">
                                <div className="icon icon-shape bg-yellow text-white rounded-circle shadow">
                                  <i className="ni ni-bullet-list-67" />
                                </div>
                              </Col>
                            </Row>
                          </CardBody>
                        </Card>
                      </Col>
                    </Row>
                  </div>
                </Container>
              </Row>
            )}
          {this.state.dataLoaded &&
            ["admin", "tenant", "franchise", "dealer"].filter(
              (role) => role === this.userRole.role
            ).length === 0 && (
              <Row>
                <Container fluid>
                  <div className="header-body">
                    <Row>
                      <Col lg="12">
                        <Card className="card-stats mb-4 mb-xl-0">
                          <CardBody>
                            <Row>
                              <div className="col">
                                <CardTitle
                                  tag="h5"
                                  className="text-uppercase text-muted mb-0"
                                >
                                  New User?
                                </CardTitle>
                                <span className="mb-0">
                                  You are not connected to any role. Please
                                  Logout and Login again. If still counter
                                  problem contact your tenant admin.
                                </span>
                              </div>
                            </Row>
                          </CardBody>
                        </Card>
                      </Col>
                    </Row>
                  </div>
                </Container>
              </Row>
            )}
        </Container>
        {!this.state.dataLoaded && (
          <div className="text-center mt-7 pt-5">
            <Spinner type="grow" color="primary" />
          </div>
        )}
      </>
    );
  }
}

export default Dashboard;
