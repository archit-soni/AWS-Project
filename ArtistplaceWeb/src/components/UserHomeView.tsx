import React from "react";
import AppAssetService from "../services/AppAssetService";
import { IUserProp, UserTypes, IUserViewState, IAsset } from "../services/AppModels";
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
import RegisterAccount from "./RegisterAccount";
//Asset on sale
//             
export default class UserHomeView extends React.Component<IUserProp, IUserViewState> {
  appService: AppAssetService;
  constructor(props: IUserProp) {
    super(props);
    this.appService = this.props.appServiceObj;
    this.state = {
      showModal: false,
      modelHeading: "",
      modelDesc: "",
      modelButtonTitle: "",
      modelTextValue: ""
    };
    this.onPrivateKeyModalToggle = this.onPrivateKeyModalToggle.bind(this);
    this.onEscrowSendModalToggle = this.onEscrowSendModalToggle.bind(this);
    this.onModalToggle = this.onModalToggle.bind(this);
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
  render() {
    const renderAssetRegistration = () => {
      return <><MyAssets updateBalance={this.props.updateBalance} updateAssets={this.props.updateAssets} registeredAssets={this.getAccountAssets()} ethUser={this.props.ethUser} appServiceObj={this.appService}></MyAssets><p></p>
         <RegisterAsset updateBalance={this.props.updateBalance} updateAssets={this.props.updateAssets} registeredAssets={this.props.registeredAssets} ethUser={this.props.ethUser} appServiceObj={this.appService}></RegisterAsset></>;
    }
    const renderBuyerAccounts = () => {
      //if (this.props.userType !== UserTypes.Admin)
    }
    return <>
      <Container fluid>
      <h3 style={{
        margin:"1%",
        padding:"0.5%",
        textAlign:"center",
        backgroundColor:"rgba(100, 50, 100, 0.3)",
        color:"white"
      }}>Welcome to Artistplace, below are some NFTs that you can buy/play</h3>
         
        <Jumbotron style={{
               backgroundColor:"rgba(1, 1, 10, 0.3)",
        }}>
          <Card>
            <Card.Body>
              <Row>
                <Col><AssetsOnMarket updateBalance={this.props.updateBalance} updateAssets={this.props.updateAssets} registeredAssets={this.getAssetOnSale()} ethUser={this.props.ethUser} appServiceObj={this.props.appServiceObj}></AssetsOnMarket></Col>
                 </Row>
            </Card.Body>
          </Card>
          <p></p>
        </Jumbotron>
      </Container>
    </>
  }
}