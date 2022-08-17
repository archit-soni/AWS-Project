import React from "react";
import AppAssetService from "../services/AppAssetService";
import { IUserProp, UserTypes, IUserViewState, IAsset, IUserViewState2 } from "../services/AppModels";
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
             
export default class UserProfileView extends React.Component<IUserProp, IUserViewState2> {
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
      bal: ""
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
      modelHeading: `Account Escrow`,
      modelDesc: `Enter the Escrow money this account want to send to the smart contract. The application must have the private key of the account in order for it to execute a balance transfer transaction. 
        The user can also use a Wallet like Metamask to send Ether to the smart contract and in that case this functionality is not needed`,
      modelButtonTitle: "Send Escrow"
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
  
  componentDidMount(){
    const { ethereum } = window;
      ethereum.request({method: 'eth_accounts'}).then((res: any)=>{
        this.appService.getAccountEtherBalance(res[res.length-1]).then((data:any)=>
            {
              this.setState({bal:data})
            })
        })
    
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
            <Card.Header>Ethereum Address: {this.props.ethUser.EthereumID}</Card.Header>
            <Card.Body>
              <ListGroup>
                <ListGroup.Item>Ether Balance: {this.state.bal}</ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col>
        <img src={picURL} style={{
          width:"50%"
        }}>
          </img></Col>
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
            <Card.Header>My Account</Card.Header>
            <Card.Body>
              <ListGroup>
                <ListGroup.Item>Artist - {this.props.ethUser.Name}</ListGroup.Item>
                <ListGroup.Item>Email - {this.props.ethUser.LoginName}</ListGroup.Item>
                <ListGroup.Item>Bio - {this.props.ethUser.Bio}</ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card></Col>
                <Col xs={6}>{renderAssetRegistration()}</Col>
                 </Row>
            </Card.Body>
          </Card>
          <p></p>
        </Jumbotron>
      </Container>
      <Modal show={this.state.showModal} onHide={this.onModalToggle}>
        <Modal.Header closeButton>
          <Modal.Title>{this.state.modelHeading}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card>
            <Card.Body>{this.state.modelDesc}</Card.Body>
          </Card>
          <p></p>
          <Form>
            <Form.Group controlId="escrowkey">
              <Form.Control
                placeholder={`Enter ${this.state.modelHeading}`}
                htmlSize={30}
                onChange={this.formDataChanged}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.onModalToggle}>
            Cancel
          </Button>
          <Button variant="primary" onClick={this.onSubmitClick}>
            {this.state.modelButtonTitle}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  }
  onSubmitClick() {
    switch (this.state.modelHeading) {
      case "Account Private Key":
        this.props.updatePrivateKey(this.props.ethUser.EthereumID, this.state.modelTextValue);
        alert("Private Key has been captured");
        this.onModalToggle();
        break;
      case "Account Escrow":
        if (!this.props.ethUser.ActPrivateKey)
          alert("Private key is required for Escrow balance to be send to the smart contract");
        else {
          this.appService.sendEscrowToContract(this.props.ethUser.ActPrivateKey, this.state.modelTextValue).then(a => {
            this.props.updateBalance(this.props.ethUser.EthereumID);
            this.onModalToggle();
          });
        }
        break;
    }
  }
  formDataChanged(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    this.setState({ modelTextValue: event.target.value });
  }
}