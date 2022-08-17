import React from "react";
import AppAssetService from "../services/AppAssetService";
import { IAssetOnSaleComponentState, IGlobalProp, IAsset } from "../services/AppModels";
import { Card, ListGroup, Media, Row, Col, Button, Container } from "react-bootstrap";

export default class AssetsOnMarket extends React.Component<
  IGlobalProp,
  IAssetOnSaleComponentState
> {
  appService: AppAssetService;
  constructor(props: IGlobalProp) {
    super(props);
    this.appService = this.props.appServiceObj;
    //this.state = { accountid: props.ethUser.EthereumID, toastShow: false, toastMsg: "" };
    this.state = { toastShow: false, toastMsg: "" };
    this.buyButtonClicked = this.buyButtonClicked.bind(this);
    this.playButtonClicked = this.playButtonClicked.bind(this);
  }
  playButtonClicked(assetid: number, assetOwner: string, e: any) {
    this.appService.onMusicPlay(assetOwner, this.props.ethUser.EthereumID, assetid);
  }
  buyButtonClicked(assetid: number, assetOwner: string, assetPrice:string, e: any) {
    this.appService.makeAssetPurchase(assetOwner, this.props.ethUser.EthereumID, assetid, assetPrice).then(() => {
      this.props.updateAssets();
      this.props.updateBalance(this.props.ethUser.EthereumID);
    });
  }
  render() {
    const renderBuyButton = (assetItem: IAsset) => {
      if (assetItem.AssetOwnerAccount.toLowerCase() !== this.props.ethUser.EthereumID.toLowerCase()) {
        return <Button
          variant="primary"
          size="sm"
          onClick={(e) =>
            this.buyButtonClicked(
              assetItem.AssetID,
              assetItem.AssetOwnerAccount,
              assetItem.AssetPrice,
              e
            )
          }
        >
          Buy
        </Button>
      }
      else{
        return <></>
      }
    }
    return (
      <>
        <Card border="primary">
          <Card.Header className="text-center" style={{
            marginBottom:"1%"
          }}>Assets on Sale</Card.Header>
          <Container style={{
            display:"grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap:"1%"
          }}>
          {this.props.registeredAssets.map((item, index) => {
              if(item.AssetPicUrl.split('.')[3]=="jpg")
              return (
                  <Card style={{
                    width:"100%"
                  }}>
                                              <Card.Header>{item.AssetTitle}{'\t'}{renderBuyButton(item)}</Card.Header>
                   <Card.Img src={item.AssetPicUrl} style={{
                    height:"260px"
                   }}></Card.Img>
                   <Card.Body>

                          <p>{item.AssetDescription}</p>
                          <p>
                            Price:{" "}
                            <Button variant="danger" size="sm" disabled>
                              {item.AssetPrice}
                            </Button>{'\t'}
                            <Button style={{
                              backgroundColor:"black"
                            }} size="sm" disabled>
                              ETH
                            </Button>
                            &nbsp;&nbsp;&nbsp;
                          </p>
                    </Card.Body>
                  </Card>
              );
              else
            return (
              <Card style={{
                width:"100%"
              }}>
                <Card.Header>{item.AssetTitle}</Card.Header>
               <Card.Img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e"></Card.Img>
               <Card.Body>
               <audio controls onPlay={(e) =>
                    this.playButtonClicked(
                      item.AssetID,
                      item.AssetOwnerAccount,
                      e
                    )
                  }>
                  <source src={item.AssetPicUrl} />
                </audio>
                      <p>{item.AssetDescription}</p>
                      <p>
                        Price:{" "}
                        <Button variant="danger" size="sm" disabled>
                          {item.AssetPrice}
                        </Button>{'\t'}
                        <Button style={{
                          backgroundColor:"black"
                        }} size="sm" disabled>
                          ETH
                        </Button>
                        &nbsp;&nbsp;&nbsp;
                      </p>{renderBuyButton(item)}
                </Card.Body>
              </Card>
            );
              })}
              </Container>
        </Card>
        {/* <Toast style={{position: 'absolute',top: 200,right: 200,}} onClose={() => this.setState({toastShow:false,toastMsg:""})} show={this.state.toastShow} delay={3000} autohide>
          <Toast.Header>
            <img
              src="holder.js/20x20?text=%20"
              className="rounded mr-2"
              alt=""
            />
            <strong className="mr-auto">Property Purchase</strong>
            <small>few seconds ago</small>
          </Toast.Header>
          <Toast.Body>{this.state.toastMsg}</Toast.Body>
        </Toast> */}
      </>
    );
  }
}
