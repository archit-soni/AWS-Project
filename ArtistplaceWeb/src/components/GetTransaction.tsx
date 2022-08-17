import React from "react";
import AppAssetService from "../services/AppAssetService";
import { IAsset, IGlobalContextState, IRegisteredUser, UserTypes } from "../services/AppModels";
import {
  Container,
  Row,
  Col,
  ButtonGroup,
  Dropdown,
  DropdownButton,
  Button,
  Card,
  ListGroup
} from "react-bootstrap/";  
import RegisterAsset from "./RegisterAsset";
import UserView from "./UserView";
import { useParams } from 'react-router-dom';
import UserProfileView from "./UserProfileView";
import TransactionView from "./TransactionView";


export default class GetTransaction extends React.Component<
  {},
  IGlobalContextState
> {
  appService: AppAssetService;

  constructor(props: any) {
    super(props);
    this.appService = new AppAssetService();
    this.state = { userInfo: [], assetInfo: [], currentuserindex: 0, dataRefreshTimestamp: Date.now().toLocaleString() }; //
    this.userButtonClicked = this.userButtonClicked.bind(this);
    this.refreshApp = this.refreshApp.bind(this);
    this.updateEtherEscrowBalance = this.updateEtherEscrowBalance.bind(this);
    this.storeAccountPrivateKey = this.storeAccountPrivateKey.bind(this);
    this.updateRegisteredAssetStatus = this.updateRegisteredAssetStatus.bind(this);
    this.newUserIsAdded = this.newUserIsAdded.bind(this);
  }
  userButtonClicked(userIndex: number, e: any) {
    this.setState({ currentuserindex: userIndex });
  }

  refreshApp() {
    this.setState({
      dataRefreshTimestamp: Date.now().toLocaleString()
    });
  }

  updateEtherEscrowBalance(ethAccount: string) {
    this.appService.getAccountEtherBalance(ethAccount).then(ethBal => {
      this.appService.getAccountEscrowBalance(ethAccount).then(escBal => {
        let stateUsers = this.state.userInfo.map(user => {
          if (user.EthereumID === ethAccount) {
            let tempuser: IRegisteredUser = {
              Name: user.Name,
              Bio: user.Bio,
              LoginName: user.LoginName,
              EthereumID: ethAccount,
              EtherBalance: ethBal,
              EscrowBalance: escBal
            };
            if (user.ActPrivateKey)
              tempuser.ActPrivateKey = user.ActPrivateKey;
            return tempuser
          }
          else
            return user;
        });
        this.setState({
          userInfo: stateUsers
        });
      });
    });
  }
  storeAccountPrivateKey(ethAccount: string, privateKey: string) {
    let stateUsers = this.state.userInfo.map(user => {
      if (user.EthereumID === ethAccount) {
        let tempuser: IRegisteredUser = {
          Name: user.Name,
          Bio: user.Bio,
          LoginName: user.LoginName,
          EthereumID: ethAccount,
          EtherBalance: user.EtherBalance,
          EscrowBalance: user.EscrowBalance,
          ActPrivateKey: privateKey
        };
        if (user.ActPrivateKey)
          tempuser.ActPrivateKey = user.ActPrivateKey;
        return tempuser
      }
      else
        return user;
    });
    this.setState({
      userInfo: stateUsers
    });
  }
  updateRegisteredAssetStatus() {
    this.appService.getAllRegisteredAsset().then(data => {
      this.setState({
        assetInfo: data
      })
    });
  }
  componentDidMount() {
    if (this.state.userInfo.length === 0) {
      this.appService.getUserInfo().then((data) => {
        for(let i=0; i<data.length; i++){
          const { ethereum } = window;
          ethereum.request({ method: 'eth_accounts' }).then((res: any)=>{
          if(res[0].toLowerCase()==data[i].EthereumID.toLowerCase()){
            this.setState({currentuserindex: i})
          }
      });
        }
        this.setState({
          userInfo: data,
          currentuserindex: 0
        });
      });
      this.appService.getAllRegisteredAsset().then(data => {
        this.setState({
          assetInfo: data
        })
      });
    }
  }
  newUserIsAdded(responseText:string) {
    this.appService.getUserInfo().then((data) => {
      this.setState({
        userInfo: data
      });
    });
  }
  render() {
    const renderUserView = () => {
      if (this.state.userInfo[this.state.currentuserindex] !== undefined) {

        let currentUser = this.state.userInfo[this.state.currentuserindex];
        if (this.state.currentuserindex === 0)
          currentUser.AppUserType = UserTypes.Admin;
        else
          currentUser.AppUserType = UserTypes.Buyer;

        return <TransactionView updateUserList={this.newUserIsAdded} updatePrivateKey={this.storeAccountPrivateKey} updateBalance={this.updateEtherEscrowBalance} updateAssets={this.updateRegisteredAssetStatus} registeredAssets={this.state.assetInfo} appServiceObj={this.appService} ethUser={currentUser}></TransactionView>
      }
      else {
        return <></>;
      }
    }
    const renderUserButton = () => {
      let current = this.state.userInfo[this.state.currentuserindex];
      console.log(current?.Name)
      return (
        <>
        <span style={{
          color:"white"}}>Current User - {current?.Name}</span>
      </>
      )
    }
      
                  
    return (
      
      <Container fluid style={{
        backgroundColor: "#232f4a"
      }}>
        <Row className="justify-content-md-center" style={{
          backgroundColor:"#232f3e"
        }}>
          <a href="/"><h1 className="display-4 App-header">Amazon Artistplace</h1></a>
        </Row>
        <Row>
          <Col>
            {renderUserButton()}
          </Col>
        </Row>
        <Row>
          <Col>
            {renderUserView()}
          </Col>
        </Row>
      </Container>
    );
  }
}
