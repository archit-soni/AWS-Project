import React from "react";
import AppAssetService from "../services/AppAssetService";
import { IAsset, IGlobalContextState, IGlobalContextState2, IRegisteredUser, UserTypes } from "../services/AppModels";
import {
  Container,
  Row,
  Col,
  ButtonGroup,
  Dropdown,
  DropdownButton,
  Button
} from "react-bootstrap/";
import RegisterAsset from "./RegisterAsset";
import UserView from "./UserView";
import UserHomeView from "./UserHomeView";
import RegisterAccount from "./RegisterAccount";

export default class Wallet extends React.Component<
  {},
  IGlobalContextState2
> {
  appService: AppAssetService;

  constructor(props: any) {
    super(props);
    this.appService = new AppAssetService();
    this.state = { userInfo: [], assetInfo: [], currentuserindex: 0, dataRefreshTimestamp: Date.now().toLocaleString(), logIn: false }; //
    this.userButtonClicked = this.userButtonClicked.bind(this);
    this.refreshApp = this.refreshApp.bind(this);
    this.updateEtherEscrowBalance = this.updateEtherEscrowBalance.bind(this);
    this.storeAccountPrivateKey = this.storeAccountPrivateKey.bind(this);
    this.updateRegisteredAssetStatus = this.updateRegisteredAssetStatus.bind(this);
    this.newUserIsAdded = this.newUserIsAdded.bind(this);
    this.connectWallet = this.connectWallet.bind(this);
  }

  connectWallet(){
    const { ethereum } = window;
    ethereum.request({method: 'eth_getTransactionByHash', params: ['0xec50c4ab674c416b4ae55281402ae6d63e02309d1e88316d6fe80c0f37f93f76']}).then((res: any)=>{
      console.log(res)
  });
    ethereum.request({ method: 'eth_requestAccounts' }).then((res: any)=>{
      console.log(res)
    });
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
              LoginName: user.LoginName,
              EthereumID: ethAccount,
              Bio: user.Bio,
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
    const renderAddUser = () => {
      if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask is installed!');
      }
      if (this.state.userInfo[this.state.currentuserindex] !== undefined) {

        let currentUser = this.state.userInfo[this.state.currentuserindex];
        if (this.state.currentuserindex === 0)
          currentUser.AppUserType = UserTypes.Admin;
        else
          currentUser.AppUserType = UserTypes.Buyer;

        return <RegisterAccount updateUserList={this.newUserIsAdded} updatePrivateKey={this.storeAccountPrivateKey} updateBalance={this.updateEtherEscrowBalance} updateAssets={this.updateRegisteredAssetStatus} registeredAssets={this.state.assetInfo} appServiceObj={this.appService} ethUser={currentUser}></RegisterAccount>
      }
      else {
        return <></>;
      }
    }
    const renderUserButton = () => {
      return (
        <>
        <DropdownButton as={ButtonGroup} title="Switch User" id="bg-nested-dropdown">  
              {this.state.userInfo.map((item, index) => {
        return (
          <>
          <Dropdown.Item variant={this.state.currentuserindex === index ? "primary" : "secondary"} onClick={(e) => this.userButtonClicked(index, e)}>{item.Name}</Dropdown.Item>
          {' '}
          </>
          
        );
      })}
      </DropdownButton>
      </>
      )
    }
    const checkLog = async () => {
      const { ethereum } = window;
      ethereum.request({method: 'eth_getTransactionByHash', params: ['0x78f5e2cb5f6742d23e14d1491720a32315ff52c478a9538f1daa6370b5739e5e']}).then((res: any)=>{
        console.log(res)
    });
      let res = await ethereum.request({method: 'eth_accounts'})
      if(res.length>0){
        console.log("you know async")
        return (
          <a href="/home">hey</a>
        )
      }
      return (
        <a href="/home">hey</a>
      )
    }
      
                  
    return (
      <Container fluid style={{
        backgroundColor:"white"
      }}>
        <Row className="justify-content-md-center" style={{
          backgroundColor:"#232f3f"
        }}>
          <a href="/"><h1 className="display-4 App-header">Amazon Artistplace</h1></a>
        </Row>
       <Container style={{
        marginLeft: "40%",
        marginTop: "20%"
       }}>
        {renderAddUser()} to access website</Container>
      </Container>
    );
  }
}
