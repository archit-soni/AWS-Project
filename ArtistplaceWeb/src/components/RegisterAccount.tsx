import React from "react";
import AppAssetService from "../services/AppAssetService";
import { IAsset, IRegisterComponentState, IGlobalProp, UserTypes, IRegisterUserState, IRegisteredUser, IUserProp } from "../services/AppModels";

import { Card, ListGroup, Media, Button, Modal, Form } from "react-bootstrap";
import AWS from "aws-sdk";
import { useNavigate } from "react-router-dom";
import GlobalContext from "./GlobalContext";

export default class RegisterAccount extends React.Component<
IUserProp,
  IRegisterUserState
> {
  appService: AppAssetService;

  constructor(props: IUserProp) {
    super(props);
    this.appService = this.props.appServiceObj;
    this.state = {
      showModal: false,
      name: "",
      username: "",
      address: "",
      bio: "",
      pic: "",
    };
    this.onSubmitClick = this.onSubmitClick.bind(this);
    this.onModalToggle = this.onModalToggle.bind(this);
    this.formDataChanged = this.formDataChanged.bind(this);
    this.refreshData = this.refreshData.bind(this);
    this.imageUpload = this.imageUpload.bind(this);
    this.connectWallet = this.connectWallet.bind(this);

  }
  componentDidMount() {
    //this.refreshData();
  }
  connectWallet(){
    const { ethereum } = window;
    let eAdd = ""
    ethereum.request({ method: 'eth_requestAccounts' }).then((res: any)=>{
      console.log(res)
      eAdd = res[0]
    }).then((data:any)=>{
      console.log('yo')
      alert(eAdd+" account added!")
      this.setState({address: eAdd})
    });
  }
  refreshData() {
    /* this.appService.getAllRegisteredAsset().then(data => {
      this.setState({ propertyAssets: data });
    }); */
  }
  onSubmitClick() {
    let _newAsset: IRegisteredUser= {
      Name: this.state.name,
      LoginName: this.state.username,
      EthereumID: this.state.address,
      Bio: this.state.bio,
      Pic: this.state.pic,
      EtherBalance: 0,
      EscrowBalance: 0,
    };
    this.appService.registerNewAccount(_newAsset)
      .then(a => {
        this.setState({ name: "", username: "", address: ""});
        //this.refreshData();
          //alert(JSON.stringify(adduserResult));
          this.props.updateUserList(a);
        //this.props.refreshView();
        this.onModalToggle();
        this.props.updateBalance(this.props.ethUser.EthereumID);
        this.props.updateAssets();
      }).then(()=>{
        window.location.replace('/')  
      });
  }

  onModalToggle() {
    this.setState((prevState, props) => {
      return { showModal: !prevState.showModal };
    });
  }
  formDataChanged(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    switch (event.target.id) {
      case "newname":
        this.setState({ name: event.target.value });
        break;
      case "newusername":
        this.setState({ username: event.target.value });
        break;
      case "newaddress":
        this.setState({ address: event.target.value });
        break;
      case "newbio":
        this.setState({ bio: event.target.value });
        break;
    }
  }
  imageUpload = (event: { target: any; }) => {
    var albumBucketName = 'market-bucke';
    var bucketRegion = "us-east-1";
    var IdentityPoolId = "us-east-1:998871c9-dce5-4185-9302-c2c08375f5bb";

    AWS.config.update({
      region: bucketRegion,
      credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: IdentityPoolId
      })
    });

    var s3 = new AWS.S3({
      apiVersion: "2006-03-01",
      params: { Bucket: albumBucketName }
    });
    var file = event.target.files[0];
    var photoKey = "profile-pic-"+this.state.username;
    var upload = new AWS.S3.ManagedUpload({
    params: {
      Bucket: albumBucketName,
      Key: photoKey,
      Body: file
    }
  });
  var promise = upload.promise();
  promise.then(
    (data) => {
      alert("Successfully uploaded photo.");
      console.log(data)
      this.setState({ pic: data.Location});
    },
    function(err) {
      return alert("There was an error uploading your photo: ");
      console.log(err)
    }
  );
  };
  render() {
    const renderRegisterButton = () => {
      return <Button variant="primary" size="sm" onClick={this.onModalToggle} >
        Register Account
      </Button>
    }
    return (
      <>
        {renderRegisterButton()}
        <Modal show={this.state.showModal} onHide={this.onModalToggle}>
          <Modal.Header closeButton>
            <Modal.Title>New Registration</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="newname">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  placeholder="Enter Account Name"
                  htmlSize={30}
                  onChange={this.formDataChanged}
                />
              </Form.Group>
              <Form.Group controlId="newusername">
                <Form.Label>E-mail</Form.Label>
                <Form.Control
                  as="textarea"
                  placeholder="Enter Username"
                  onChange={this.formDataChanged}
                />
              </Form.Group>
                <Button onClick={this.connectWallet}>Connect Wallet</Button>
              <Form.Group controlId="newbio">
                <Form.Label>Bio</Form.Label>
                <Form.Control
                  as="textarea"
                  placeholder="Enter bio"
                  htmlSize={30}
                  onChange={this.formDataChanged}
                />
              </Form.Group>
              <Form.Label>Profile Picture</Form.Label>
              <Form.Group controlId="newpic">
                <input type="file" onChange={this.imageUpload}/>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.onModalToggle}>
              Close
            </Button>
            <Button variant="primary" onClick={this.onSubmitClick}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}
