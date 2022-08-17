import AWS from 'aws-sdk'

export default class S3LogicObject{
    constructor(){
        AWS.config.update({region:'us-east-1'})
        this.s3Client = new AWS.S3({apiVersion: '2006-03-01'});
        this.s3Table='ShareToWin2';

        this.createItemInDb=this.createItemInDb.bind(this);
        this.getItemFromDb=this.getItemFromDb.bind(this);
        this.getAllItems=this.getAllItems.bind(this);
    }
    createItemInDb(assetId,assetTitle,assetDesc,assetPicUrl,nftID,resultCallback){
        var params={
            TableName:this.dbTable,
            Item:{
                'AssetID':assetId,
                'AssetTitle':assetTitle,
                'AssetDescription':assetDesc,
                'AssetPicUrl':assetPicUrl,
                'AssetNFTId':nftID
            }
        };
        this.dbClient.put(params,(err,data) => {
            if(err){
                resultCallback({'status':'Error','Msg':err,'data':''});
            }
            else{
                resultCallback({'status':'Success','Msg':'','data':assetId});
            }
        });
    }

    getItemFromDb(assetID,resultCallback){
        var params = {
            TableName: this.dbTable,
            Key: {'AssetID': assetID}
        };
        this.dbClient.get(params,(err,data) => {
            if(err){
                resultCallback({'status':'Error','Msg':err,'Items':[]});
            }
            else{
                resultCallback({'status':'Success','Msg':'','Items': data.Item});
            }
            
        });
    }

    getAllItems(resultCallback){
        var params = {
            TableName: this.dbTable
        };
        this.dbClient.scan(params,(err,data) => {
            if(err){
                resultCallback({'status':'Error','Msg': err, 'Items':[]});
            }
            else{
                resultCallback({'status':'Success','Msg': '', 'Items':data.Items});
            }
        });
    }
    getAllItemsByKeys(keys,resultCallback){
        var params = {
            TableName: this.dbTable
        };
        this.dbClient.scan(params,(err,data) => {
            if(err){
                resultCallback({'status':'Error','Msg': err, 'Items':[]}); 
            }
            else{
                if(data.Count>0){
                    let dbItem=[];

                    data.Items.forEach(resultItem=>{
                        for(let i=0; i<keys.length; i++){
                            if(resultItem.AssetID===keys[i]){
                                dbItem.push(resultItem);
                                break;
                            }
                        }
                    })
                    resultCallback({'status':'Success','Msg': '', 'Items':dbItem});
                }
                else{
                    resultCallback({'status':'Error','Msg': err, 'Items':[]});
                }
            }
        });
    }
}