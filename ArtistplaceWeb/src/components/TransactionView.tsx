import React from "react";
import AppAssetService from "../services/AppAssetService";
import { IUserProp, UserTypes, IUserViewState, IAsset, ITransactionState } from "../services/AppModels";
import {
  Container,
  Jumbotron,
  Card,
  Row,
  Col,
  ListGroup,
  Button,
  Modal, Form, Navbar, Nav
} from "react-bootstrap/";
import RegisterAsset from "./RegisterAsset";
import AssetsOnMarket from "./AssetsOnMarket";
import MyAssets from "./MyAssets";
import { info } from "console";
//Asset on sale
//<Col><AssetsOnMarket updateBalance={this.props.updateBalance} updateAssets={this.props.updateAssets} registeredAssets={this.getAssetOnSale()} ethUser={this.props.ethUser} appServiceObj={this.props.appServiceObj}></AssetsOnMarket></Col>
             
export default class TransactionView extends React.Component<IUserProp, ITransactionState> {
  appService: AppAssetService;
  constructor(props: IUserProp) {
    super(props);
    this.appService = this.props.appServiceObj;
    this.state = {
      showModal: false,
      modelHeading: "",
      modelDesc: "",
      modelButtonTitle: "",
      modelTextValue: "",
      txInfo: ""
    };
    this.onPrivateKeyModalToggle = this.onPrivateKeyModalToggle.bind(this);
    this.onEscrowSendModalToggle = this.onEscrowSendModalToggle.bind(this);
    this.onModalToggle = this.onModalToggle.bind(this);
    this.onSubmitClick = this.onSubmitClick.bind(this);
    this.formDataChanged = this.formDataChanged.bind(this);
    this.getAccountAssets = this.getAccountAssets.bind(this);
    this.getAssetOnSale = this.getAssetOnSale.bind(this);

    this.addBuyerClick = this.addBuyerClick.bind(this);
  }
  /* componentDidMount() {
    let newEtherBalance:number;
    let newEscrowBalance:number;

    this.appService.getAccountEtherBalance(this.props.appUser.EthereumID).then(ethBal => {
      newEtherBalance=ethBal;
      this.appService.getAccountEscrowBalance(this.props.appUser.EthereumID).then(escBal => {
        newEscrowBalance=escBal;
        if(newEscrowBalance!==this.props.appUser.EscrowBalance || newEtherBalance!==this.props.appUser.EtherBalance)
          this.props.updateBalance(newEtherBalance,newEscrowBalance);
      });
    });
  } */
  getAccountAssets(): IAsset[] {
    let returnVal = this.props.registeredAssets.filter(element => {
      return element.AssetOwnerAccount.toLowerCase() === this.props.ethUser.EthereumID.toLowerCase()
    });
    return returnVal;
  }
  getAssetOnSale(): IAsset[] {
    let returnVal = this.props.registeredAssets.filter(element => {
      return element.IsAssetOnSale === true;
    });
    return returnVal;
  }

  onPrivateKeyModalToggle() {
    this.setState({
      modelHeading: `Account Private Key`,
      modelDesc: `The private key entered here will only exists in this browser session and will not persist in any storage. This key will not be available when the SPA will be refreshed.`,
      modelButtonTitle: "Send Key"
    });
    this.onModalToggle();
  }
  onEscrowSendModalToggle() {
    this.setState({
      modelHeading: `Tip Artist`,
      modelDesc: `Enter Tip Amount`,
      modelButtonTitle: "Send Tip"
    });
    this.onModalToggle();
  }
  onModalToggle() {
    this.setState((prevState, props) => {
      return { showModal: !prevState.showModal };
    });
  }
  addBuyerClick(eventKey: any) {
    this.appService.addNewUser().then(adduserResult=>{
      //alert(JSON.stringify(adduserResult));
      this.props.updateUserList(adduserResult);
    });
  }
  render() {
    const renderAssetRegistration = () => {
      return <><MyAssets updateBalance={this.props.updateBalance} updateAssets={this.props.updateAssets} registeredAssets={this.getAccountAssets()} ethUser={this.props.ethUser} appServiceObj={this.appService}></MyAssets><p></p>
        <RegisterAsset updateBalance={this.props.updateBalance} updateAssets={this.props.updateAssets} registeredAssets={this.props.registeredAssets} ethUser={this.props.ethUser} appServiceObj={this.appService}></RegisterAsset></>;
    }
    const renderAdminContent = () => {
    }
    const renderBuyerAccounts = () => {
      var picURL = "https://d1vqvpjdvbwzf.cloudfront.net/profile-pic-"+this.props.ethUser.LoginName
      //if (this.props.userType !== UserTypes.Admin)
      return <Row>
        <Col>
          <Card>
          <Card.Header>Get Information about a Transaction by Tx Hash</Card.Header>
            <Card.Body>
            <Form>
            <Form.Group controlId="escrowkey">
              <Form.Control
                placeholder={`Enter Transaction Hash`}
                htmlSize={30}
                onChange={this.formDataChanged}
              />
            </Form.Group>
          </Form>
              <ListGroup>
                <ListGroup.Item><Button variant="secondary" size="sm" onClick={this.onSubmitClick} >Submit Transaction Hash</Button></ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    }
    return <>
      <Container fluid>
        <Jumbotron>
          {renderAdminContent()}
          {renderBuyerAccounts()}<p></p>
          <Card>
            <Card.Body>
              <Row>
                <Col><Card>
            <Card.Header>Information about {this.state.modelTextValue}</Card.Header>
            <Card.Body>
                <pre>{this.state.txInfo}</pre>
            </Card.Body>
          </Card></Col>
                 </Row>
            </Card.Body>
          </Card>
          <p></p>
        </Jumbotron>
      </Container>
    </>
  }
  onSubmitClick() {
    const { ethereum } = window;
      ethereum.request({method: 'eth_getTransactionByHash', params: [this.state.modelTextValue]}).then((res: any)=>{
       this.setState({ txInfo: JSON.stringify(res, null, 2)});
    });
  }
  formDataChanged(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    this.setState({ modelTextValue: event.target.value });
  }
}