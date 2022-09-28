import React, { Component } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
  Spinner,
} from "reactstrap";
import franchiseService from "../services/franchiseService";
import networkServerService from "../services/networkServerService";
import tenantService from "../services/tenantService";
import Header from "../components/Headers/Header";
import Joi from "joi";
import validationService from "../services/validationService";
import _ from "lodash";
import toastService from "../services/toastService";
import alertService from "../services/alertService";
import dealerService from "../services/dealerService";
import billingService from "../services/billingService";
import authService from "../services/authService";

class BillingForm extends Component {
  state = {
    data: {
      id: 0,
      dealerId: "",
      franchiseId: "",
      amount: "",
      userId: "",
      tenantId: "",
    },
    tenants: [],
    franchises: [],
    dealers: [],
    users: [],

    availableFranchises: [],
    availableDealers: [],
    availableUsers: [],
    errors: {},
    submitDisabled: false,
    formEnabled: false,
    dataLoaded: false,
  };

  schema = Joi.object().keys({
    id: Joi.number().label("Billing Id"),
    dealerId: Joi.number().required().label("Dealer Id"),
    franchiseId: Joi.number().required().label("Franchise Id"),
    amount: Joi.number().required().label("amount"),
    userId: Joi.number().required().label("User Id"),
    tenantId: Joi.number().required().label("Tenant Id"),
  });

  userRole = authService.getCurrentRole();

  async componentDidMount() {
    this.setState({ formEnabled: false, dataLoaded: false });
    try {
      const { data: responseTenant } = await tenantService.getTenants();
      console.log(responseTenant);
      if (responseTenant.data.tenants) {
        this.setState({
          tenants: responseTenant.data.tenants.map((t) =>
            _.pick(t, ["id", "companyName"])
          ),
        });
      }
      const { data: responseFranchises } =
        await franchiseService.getFranchises();
      console.log(responseFranchises);
      if (responseFranchises.data.franchises) {
        this.setState({
          franchises: responseFranchises.data.franchises.map((t) =>
            _.pick(t, ["id", "name", "networkServerId", "tenantId"])
          ),
        });
      }
      const { data: responseDealers } = await dealerService.getDealers();
      console.log(responseDealers);
      if (responseDealers.data.dealers) {
        this.setState({
          dealers: responseDealers.data.dealers.map((t) =>
            _.pick(t, ["id", "name", "franchiseId"])
          ),
        });
      }
      const { data: response } = await authService.getCurrentUserData();
      console.log("u", response);
      if (response.data) {
        this.setState({
          users: _.pick(response.data.user, [
            "id",
            "firstName",
            "lastName",
            "userName",
            "email",
          ]),
        });
      }
    } catch (ex) {
      toastService.error(ex.message);
    }
    const billingId = this.props.match.params.billingId;
    if (billingId && !isNaN(billingId)) {
      try {
        const { data: response } = await billingService.getBilling(billingId);
        console.log(response);
        if (response.data.billing) {
          let billing = _.pick(response.data.billing, [
            "id",
            "tenantId",
            "dealerId",
            "franchiseId",
            "amount",
            "userId",
          ]);

          billing.dealerId = billing.dealerId + "";
          let dealers = this.state.dealers.filter(
            (d) => d.id == billing.dealerId
          );
          if (dealers.length > 0) {
            billing.franchiseId = dealers[0].franchiseId + "";
          }

          let franchises = this.state.franchises.filter(
            (f) => f.id == billing.franchiseId
          );
          if (franchises.length > 0) {
            billing.tenantId = franchises[0].tenantId + "";
          }
          billing.userId = this.state.users.id + "";

          console.log(billing);

          this.setState({ data: billing });
        }
      } catch (ex) {
        toastService.error(ex.message);
      }
    } else {
      if (this.userRole.role === "tenant") {
        this.setState({
          data: { ...this.state.data, tenantId: this.userRole.tenantId + "" },
        });
      } else if (this.userRole.role === "franchise") {
        this.setState({
          data: {
            ...this.state.data,
            tenantId: this.userRole.tenantId + "",
            franchiseId: this.userRole.franchiseId + "",
          },
        });
      }
    }
    this.handleFranchiseList(this.state.data.tenantId);
    this.setState({ formEnabled: true, dataLoaded: true });
  }

  handleSubmit = () => {
    const errors = validationService.validate(this.state.data, this.schema);
    this.setState({ errors: errors || {} });
    console.log(errors);
    if (errors) return;
    this.doSubmit();
  };

  handleChange = ({ currentTarget: input }) => {
    const errors = { ...this.state.errors };
    const errorMessage = validationService.validateProperty(input, this.schema);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];
    const data = { ...this.state.data, [input.name]: input.value };
    // data[input.name] = input.value;

    this.setState({ data, errors });

    if (input.name === "tenantId") {
      this.handleFranchiseList(input.value);
    }
    if (input.name === "franchiseId") {
      this.handleDealerList(input.value, this.state.data.tenantId);
    }
  };

  doSubmit = async () => {
    this.setState({ submitDisabled: true });
    const { data } = this.state;
    console.log(data);
    this.setState({ formEnabled: false });
    try {
      if (this.state.data.id === 0) {
        let response = await billingService.addBilling(data);
        alertService.show({ text: "Billing Added", icon: "success" });
        console.log(response);
        this.setState({ submitDisabled: false });
        this.props.history.push(`/dashboard/billings`);
      } else {
        let response = await billingService.updateBilling(data);
        alertService.show({ text: "Bilings Updated", icon: "success" });
        this.setState({ submitDisabled: false });
        this.props.history.push(`/dashboard/billings`);
      }
    } catch (ex) {
      toastService.error(ex.message);
      this.setState({ submitDisabled: false });
    }
  };
  handleFranchiseList = (tenantId) => {
    let availableFranchises = this.state.franchises.filter(
      (f) => f.tenantId == tenantId
    );
    console.log("a", availableFranchises);
    this.setState({ availableFranchises });

    if (
      availableFranchises.filter((f) => f.tenantId == this.state.data.tenantId)
        .length === 0
    ) {
      const data = { ...this.state.data };
      data.franchiseId = "";
      data.tenantId = tenantId;
      this.setState({ data });
      this.handleDealerList("", tenantId);
    } else {
      this.handleDealerList(this.state.data.franchiseId, tenantId);
    }
  };

  handleDealerList = (franchiseId, tenantId) => {
    console.log("Franchise: " + franchiseId);
    let availableDealers = this.state.dealers.filter(
      (d) => d.franchiseId == franchiseId
    );
    this.setState({ availableDealers });

    console.log(availableDealers);
    if (
      availableDealers.filter(
        (d) => d.franchiseId == this.state.data.franchiseId
      ).length === 0
    ) {
      const data = { ...this.state.data };
      data.tenantId = tenantId;
      data.franchiseId = franchiseId;
      data.dealerId = "";
      console.log("Data log", this.state.data.tenantId, data);
      this.setState({ data });
    }
  };

  render() {
    return (
      <>
        <Header />
        <Container className="mt--7" fluid>
          <Row>
            <Col className="order-xl-1">
              <Card className="bg-secondary shadow">
                <CardHeader className="bg-white border-0">
                  <Row className="align-items-center">
                    <Col xs="8">
                      <h3 className="mb-0">
                        {this.state.data.id === 0
                          ? "Add Billings"
                          : `Update Billings: ${this.state.data.id}`}
                      </h3>
                    </Col>
                    <div className="col text-right">
                      <Button
                        color="primary"
                        disabled={this.state.submitDisabled}
                        onClick={(e) => {
                          e.preventDefault();
                          this.handleSubmit();
                        }}
                        size="sm"
                      >
                        {this.state.submitDisabled && (
                          <Spinner type="grow" color="light" size="sm" />
                        )}

                        {this.state.data.id === 0 ? "Save" : "Update"}
                      </Button>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody>
                  {this.state.dataLoaded && (
                    <Form>
                      <h6 className="heading-small text-muted mb-4">
                        Billing information
                      </h6>
                      <div className="pl-lg-4">
                        {["admin"].filter((role) => role === this.userRole.role)
                          .length > 0 && (
                          <Row>
                            <Col md="12">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-tenant"
                                >
                                  Tenant
                                </label>
                                <Input
                                  className="form-control-alternative"
                                  id="input-tenant"
                                  name="tenantId"
                                  placeholder="Tenant"
                                  type="select"
                                  autoComplete="new-tenant"
                                  value={this.state.data.tenantId}
                                  onChange={this.handleChange}
                                >
                                  state
                                  <option value="">Select Tenant</option>
                                  {this.state.tenants.map((option) => (
                                    <option key={option.id} value={option.id}>
                                      {option.companyName}
                                    </option>
                                  ))}
                                </Input>
                                {this.state.errors.tenantId && (
                                  <small className="text-danger mx-1">
                                    Select a valid "Tenant"
                                  </small>
                                )}
                              </FormGroup>
                            </Col>
                          </Row>
                        )}
                        {["admin", "tenant"].filter(
                          (role) => role === this.userRole.role
                        ).length > 0 && (
                          <Row>
                            <Col md="12">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-franchise"
                                >
                                  Franchise
                                </label>
                                <Input
                                  className="form-control-alternative"
                                  id="input-franchise"
                                  name="franchiseId"
                                  placeholder="Franchise"
                                  type="select"
                                  autoComplete="new-franchise"
                                  value={this.state.data.franchiseId}
                                  onChange={this.handleChange}
                                >
                                  <option value="">Select Franchise</option>
                                  {this.state.availableFranchises.map(
                                    (option) => (
                                      <option key={option.id} value={option.id}>
                                        {option.name}
                                      </option>
                                    )
                                  )}
                                </Input>
                                {this.state.errors.franchiseId && (
                                  <small className="text-danger mx-1">
                                    Select a valid "Franchise"
                                  </small>
                                )}
                              </FormGroup>
                            </Col>
                          </Row>
                        )}
                        {["admin", "tenant", "franchise"].filter(
                          (role) => role === this.userRole.role
                        ).length > 0 && (
                          <Row>
                            <Col md="12">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-dealer"
                                >
                                  Dealer
                                </label>
                                <Input
                                  className="form-control-alternative"
                                  id="input-dealer"
                                  name="dealerId"
                                  placeholder="Dealer"
                                  type="select"
                                  autoComplete="new-dealer"
                                  value={this.state.data.dealerId}
                                  onChange={this.handleChange}
                                >
                                  <option value="">Select Dealer</option>
                                  {this.state.availableDealers.map((option) => (
                                    <option key={option.id} value={option.id}>
                                      {option.name}
                                    </option>
                                  ))}
                                </Input>
                                {this.state.errors.dealerId && (
                                  <small className="text-danger mx-1">
                                    Select a valid "Dealer"
                                  </small>
                                )}
                              </FormGroup>
                            </Col>
                          </Row>
                        )}

                        <Row>
                          <Col md="4">
                            <FormGroup>
                              <label
                                className="form-control-label"
                                htmlFor="input-user"
                              >
                                User
                              </label>
                              <Input
                                className="form-control-alternative"
                                id="input-user"
                                name="userId"
                                placeholder="User"
                                type="select"
                                autoComplete="new-user"
                                value={this.state.data.userId}
                                onChange={this.handleChange}
                              >
                                <option value="">Select user</option>
                                <option
                                  key={this.state.users.id}
                                  value={this.state.users.id}
                                >
                                  {this.state.users.firstName}
                                </option>
                              </Input>
                              {this.state.errors.userId && (
                                <small className="text-danger mx-1">
                                  Select a valid "user"
                                </small>
                              )}
                            </FormGroup>
                          </Col>

                          <Col md="4">
                            <FormGroup>
                              <label
                                className="form-control-label"
                                htmlFor="input-amount"
                              >
                                Amount
                              </label>
                              <Input
                                className="form-control-alternative"
                                id="input-amount"
                                name="amount"
                                placeholder="Amount"
                                type="number"
                                autoComplete="new-amount"
                                value={this.state.data.amount}
                                onChange={this.handleChange}
                              />
                              {this.state.errors.amount && (
                                <small className="text-danger mx-1">
                                  {this.state.errors.amount}
                                </small>
                              )}
                            </FormGroup>
                          </Col>
                        </Row>
                      </div>
                    </Form>
                  )}
                  {!this.state.dataLoaded && (
                    <div className="text-center m-5">
                      <Spinner type="grow" color="primary" />
                    </div>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default BillingForm;
