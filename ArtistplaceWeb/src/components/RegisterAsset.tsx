import React from "react";
import AppAssetService from "../services/AppAssetService";
import AWS from "aws-sdk";
import fs from "fs";
import { IAsset, IRegisterComponentState, IGlobalProp, UserTypes, IRegisteredUser } from "../services/AppModels";

import { Card, ListGroup, Media, Button, Modal, Form } from "react-bootstrap";

export default class RegisterAssets extends React.Component<
IGlobalProp,
  IRegisterComponentState
> {
  appService: AppAssetService;
  username: IRegisteredUser;

  constructor(props: IGlobalProp) {
    super(props);
    this.appService = this.props.appServiceObj;
    this.username = this.props.ethUser;

    this.state = {
      showModal: false,
      assetTitle: "",
      assetDescription: "",
      assetUrl: "",
      assetPrice: "",
      assetUsername: ""
    };
    this.onSubmitClick = this.onSubmitClick.bind(this);
    this.onModalToggle = this.onModalToggle.bind(this);
    this.formDataChanged = this.formDataChanged.bind(this);
    this.refreshData = this.refreshData.bind(this);
    this.imageUpload = this.imageUpload.bind(this);
    this.redirect = this.redirect.bind(this);
  }
  componentDidMount() {
    //this.refreshData();
  }
  refreshData() {
    /* this.appService.getAllRegisteredAsset().then(data => {
      this.setState({ propertyAssets: data });
    }); */
  }
  onSubmitClick() {
    let _newAsset: IAsset = {
      AssetTitle: this.state.assetTitle,
      AssetDescription: this.state.assetDescription,
      AssetPicUrl: this.state.assetUrl,
      AssetPrice:this.state.assetPrice,
      AssetOwnerAccount:this.props.ethUser.EthereumID,
      AssetOwnerUsername:this.props.ethUser.LoginName,
      AssetID: 0,
      IsAssetOnSale:true
    };
    this.appService.registerNewAsset(_newAsset)
      .then(a => {
        alert("Transaction Hash for this uploading this NFT is " + a.TranSummary['TransactionHash'])
        this.setState({ assetTitle: "", assetDescription: "", assetUrl: "", assetPrice: "" });
        //this.refreshData();
        //this.props.refreshView();
        this.onModalToggle();
        this.props.updateBalance(this.props.ethUser.EthereumID);
        this.props.updateAssets();
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
      case "assettitle":
        this.setState({ assetTitle: event.target.value });
        break;
      case "assetdesc":
        this.setState({ assetDescription: event.target.value });
        break;
      case "assetpicurl":
        let url = "https://d1vqvpjdvbwzf.cloudfront.net/"
        /*AWS.config.update({region: 'us-east-1'});
        var s3 = new AWS.S3({apiVersion: '2006-03-01'});
        var uploadParams = {Bucket: 'market-bucke', Key: '', Body: ''};*/
        url = URL.createObjectURL((event.target! as HTMLInputElement)!.files![0]);
        /*var file = url;
        var fileStream = fs.createReadStream(file);
        uploadParams.Body = fileStream;
        var path = require('path');
        uploadParams.Key = path.basename(file);
        s3.upload(uploadParams)*/
        this.setState({ assetUrl: url});
        break;
      case "assetprice":
        this.setState({ assetPrice: event.target.value });
        break;
    }
  }
  redirect = (id:string) => {
    sessionStorage.setItem("currentUser", JSON.stringify(this.props.ethUser));
    window.location.href = 'http://project-1316804381.us-east-1.elb.amazonaws.com/profile/'+id;
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
    var file = event.target.files[0]
    var split = file['name'].split('.')
    var type = split[split.length-1]
    var cloudFront = "https://d1vqvpjdvbwzf.cloudfront.net/"
    var photoKey = Math.random().toString(36).slice(2, 7)+"."+type;
    var objURL = cloudFront+photoKey
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
      alert("Successfully uploaded.");
      console.log(data)
      this.setState({ assetUrl: objURL});
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
        Register New Asset
      </Button>
    }
    const renderRegisteredAssetList = () => {
        return <Card border="primary">
          <Card.Header className="text-center">All Registered Assets</Card.Header>
          <ListGroup>
            {this.props.registeredAssets.map((item, index) => {
              console.log(item.AssetPicUrl.split('.')[3])
              if(item.AssetPicUrl.split('.')[3]=="jpg")
              return (
                <ListGroup.Item key={index}>
                  <Media>
                    <img
                      width={80}
                      height={64}
                      className="mr-3"
                      src={item.AssetPicUrl}
                      alt="Generic placeholder"
                    />
                    <Media.Body>
                      <h5>{item.AssetTitle}</h5>
                      <p>{item.AssetDescription}</p>
                      <p>Owned by <button onClick={() => this.redirect(item.AssetOwnerAccount)}>{ item.AssetOwnerAccount}</button></p>
                    </Media.Body>
                  </Media>
                </ListGroup.Item>
              );
            else
            return (
              <ListGroup.Item key={index}>
                <audio controls>
                  <source src={item.AssetPicUrl} />
                </audio>
                <Media>
                    <img
                      width={80}
                      height={64}
                      className="mr-3"
                      src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e"
                      alt="Generic placeholder"
                    />
                    <Media.Body>
                      <h5>{item.AssetTitle}</h5>
                      <p>{item.AssetDescription}</p>
                      <p>Owned by <button onClick={() => this.redirect(item.AssetOwnerAccount)}>{ item.AssetOwnerAccount}</button></p>
                    </Media.Body>
                  </Media> </ListGroup.Item>
            );
            })}
          </ListGroup>
          <Card.Body className="text-center">
            {renderRegisterButton()}
          </Card.Body>
        </Card>
    };
    return (
      <>
        {renderRegisteredAssetList()}
        <Modal show={this.state.showModal} onHide={this.onModalToggle}>
          <Modal.Header closeButton>
            <Modal.Title>New Registration</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="assettitle">
                <Form.Label>Asset Name</Form.Label>
                <Form.Control
                  placeholder="Enter Asset Title"
                  htmlSize={30}
                  onChange={this.formDataChanged}
                />
              </Form.Group>
              <Form.Group controlId="assetdesc">
                <Form.Label>Asst Description</Form.Label>
                <Form.Control
                  as="textarea"
                  placeholder="Enter Asset Description"
                  onChange={this.formDataChanged}
                />
              </Form.Group>
              <Form.Group controlId="assetpicurl">
                <input type="file" onChange={this.imageUpload} />
              </Form.Group>
              <Form.Group controlId="assetprice">
                <Form.Label>Asset Price</Form.Label>
                <Form.Control
                  placeholder="Enter Asset Price"
                  htmlSize={30}
                  onChange={this.formDataChanged}
                />
                <Form.Text>Enter initial price of asset in Ether</Form.Text>
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
