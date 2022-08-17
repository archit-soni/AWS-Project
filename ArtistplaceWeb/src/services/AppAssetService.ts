import AWS from 'aws-sdk';
import { IAsset, IRegisteredUser} from './AppModels';

export default class AppAssetService {
    apiUrlEndPoint: string = "http://localhost:4080/";
    getMethodCall: any;
    postMethodCall: any;

    constructor() {
        this.getMethodCall = {
            method: 'GET',
            headers: { 'Content-type': 'application/json;charset=UTF-8' }
        };
        this.postMethodCall = {
            method: 'POST',
            headers: { 'Content-type': 'application/json;charset=UTF-8' }
        }
        if(this.apiUrlEndPoint===""){
            fetch('config.json', {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }).then(data=>{return data.json()}).then(j=>{this.apiUrlEndPoint=j.SERVER_URL;})
        }
    }
    public async getUserInfo(): Promise<IRegisteredUser[]> {
        let returnVal: IRegisteredUser[] = [];
        let rawResponse = await fetch(this.apiUrlEndPoint + 'users', this.getMethodCall);
        
        if (rawResponse.ok === true) {
            returnVal = await rawResponse.json();
        }
        return new Promise<IRegisteredUser[]>((resolve) => { resolve(returnVal) });
    }
    public async getUserProfile(username:string): Promise<IRegisteredUser> {
        let returnVal: IRegisteredUser;
        let rawResponse = await fetch(this.apiUrlEndPoint + 'users/' + username, this.getMethodCall);
        
        if (rawResponse.ok === true) {
            returnVal = await rawResponse.json();
        }
        return new Promise<IRegisteredUser>((resolve) => { resolve(returnVal) });
    }
    public async getAllRegisteredAsset(): Promise<IAsset[]> {
        let jsonReturnContent:IAsset[]
        let rawResponse = await fetch(this.apiUrlEndPoint, this.getMethodCall);
        if (rawResponse.ok === true) {
            jsonReturnContent = await rawResponse.json();
        }
        return new Promise<IAsset[]>((resolve) => { resolve(jsonReturnContent) });
    }
    public async registerNewAsset(newAsset: IAsset) {
        
        let reqContent = {
            method: 'POST',
            headers: { 'Content-type': 'application/json;charset=UTF-8' },
            body: JSON.stringify({
                "assetTitle": newAsset.AssetTitle,
                "assetDesc": newAsset.AssetDescription,
                "assetUrl": newAsset.AssetPicUrl,
                "salePrice": newAsset.AssetPrice,
                "ownerAddress":newAsset.AssetOwnerAccount,
                "ownerUsername": newAsset.AssetOwnerUsername
            })
        }
        let createApiEndPoint = this.apiUrlEndPoint + 'createregistration';
        let rawResponse = await fetch(createApiEndPoint, reqContent);
        let returnContent = await rawResponse.json();
        return returnContent;
    }
    
    public async getAccountEscrowBalance(accountID: string): Promise<number> {
        let returnVal: number;
        let rawResponse = await fetch(this.apiUrlEndPoint + "escrow/" + accountID, this.getMethodCall);
       
        if (rawResponse.ok=== true) {
            returnVal = await rawResponse.json();
        }
        return new Promise<number>((resolve) => { resolve(returnVal) });
    }
    public async getAccountEtherBalance(accountID: string): Promise<number> {
        let returnVal: number;
        let rawResponse = await fetch(this.apiUrlEndPoint + "ether/" + accountID, this.getMethodCall);
       
        if (rawResponse.ok=== true) {
            returnVal = await rawResponse.json();
        }
        return new Promise<number>((resolve) => { resolve(returnVal) });
    }
    public async getUserEth(address: string): Promise<number> {
        let returnVal: number;
        let rawResponse = await fetch(this.apiUrlEndPoint + "balance/" + address, this.getMethodCall);
       
        if (rawResponse.ok=== true) {
            returnVal = await rawResponse.json();
        }
        return new Promise<number>((resolve) => { resolve(returnVal) });
    }
    public async sendTip(toAddress: string, amount: string){
        const { ethereum } = window;
        let eAdd = ""
        let accounts = []
        accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        console.log("hey")
        console.log(accounts)
        let res = await ethereum.request({
            method: 'eth_sendTransaction',
            params: [
                {
                from: accounts[0],
                to: toAddress,
                value: (Number(amount)*Math.pow(10, 18)).toString(16),
                },
            ],
            })
        let txHash = await res
        if(txHash!=undefined){
            alert(txHash)
        }
    }
    public async makeAssetPurchase(fromAddress: string, toAddress: string, assetID: number, assetPrice: string): Promise<string> {
        let returnVal: string = "";
        let transPar = {
            to: toAddress.toLowerCase(),
            from: fromAddress.toLowerCase(),
            value: (Number(assetPrice)*Math.pow(10, 18)).toString(16)
        }
        const { ethereum } = window;
        let eAdd = ""
        let accounts = []
        accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        console.log("hey")
        console.log(accounts)
        let res = await ethereum.request({
            method: 'eth_sendTransaction',
            params: [
                {
                from: accounts[0],
                to: fromAddress,
                value: (Number(assetPrice)*Math.pow(10, 18)).toString(16),
                },
            ],
            })
        let txHash = await res
        if(txHash!=undefined){
            alert(txHash)
            // Load the AWS SDK for Node.js
            AWS.config.update({region: 'us-east-1'});

            // Create sendEmail params 
            var params = {
            Destination: { /* required */
                CcAddresses: [
                /* more items */
                ],
                ToAddresses: [
                'archit2@ualberta.ca',
                /* more items */
                ]
            },
            Message: { /* required */
                Body: { /* required */
                Html: {
                    Charset: "UTF-8",
                    Data: "Your NFT was sold"
                   },
                   Text: {
                    Charset: "UTF-8",
                    Data: "Your NFT was sold"
                   }
                },
                Subject: {
                Charset: 'UTF-8',
                Data: 'Notification from Artistplace'
                }
                },
            Source: 'arcsoni@amazon.com', /* required */
            ReplyToAddresses: [
                /* more items */
            ],
            };
            var IdentityPoolId = "us-east-1:998871c9-dce5-4185-9302-c2c08375f5bb";

            AWS.config.update({
            region: 'us-east-1',
            credentials: new AWS.CognitoIdentityCredentials({
                IdentityPoolId: IdentityPoolId
            })
            });
            // Create the promise and SES service object
            var sendPromise = new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();

            // Handle promise's fulfilled/rejected states
            sendPromise.then(
            function(data) {
                console.log(data.MessageId);
            }).catch(
                function(err) {
                console.error(err, err.stack);
            });

            let reqContent = {
                method: 'POST',
                headers: { 'Content-type': 'application/json;charset=UTF-8' },
                body: JSON.stringify({
                    "fromAccount": fromAddress,
                    "toAccount": toAddress,
                    "assetID": assetID,
                    "assetPrice": assetPrice,
                })
            }
            let createApiEndPoint = this.apiUrlEndPoint + 'transfer';
            let rawResponse = await fetch(createApiEndPoint, reqContent);
            let returnContent = await rawResponse.json();
            if (returnContent.status === 'Token Transfered') {
                returnVal = "Purchase of property was successful"
            }
            else {
                let x: string = JSON.stringify(returnContent.ErrorMsg.data);
                x = x.substring(x.indexOf('\"reason\":') + 9);
                returnVal = x.substring(0, x.indexOf('\"}'));
            }
        }
        //console.log(fromAddress);

        return new Promise<string>((resolve) => { resolve(returnVal) });
    }
    public async onMusicPlay(fromAddress: string, toAddress: string, assetID: number) {
        //console.log(fromAddress);
            const { ethereum } = window;
            let eAdd = ""
            let accounts = []
            accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            console.log("hey")
            console.log(accounts)
            let res = await ethereum.request({
                method: 'eth_sendTransaction',
                params: [
                    {
                    from: accounts[0],
                    to: fromAddress,
                    value: (Number(1)*Math.pow(10, 16)).toString(16),
                    },
                ],
                })
            let txHash = await res
            if(txHash!=undefined){
                alert("Paid 0.01 ETH for playing music.\n Transaction Hash: "+txHash)
            }
        }
    public async listAssetForSale(fromAddress: string,salePrice: string, assetID: number): Promise<string> {
        let returnVal: string = "";
        let reqContent = {
            method: 'POST',
            headers: { 'Content-type': 'application/json;charset=UTF-8' },
            body: JSON.stringify({
                "fromAccount": fromAddress,
                "salePrice": Number(salePrice),
                "assetID": assetID
            })
        }
        let createApiEndPoint = this.apiUrlEndPoint + 'assetonmarket';
        let rawResponse = await fetch(createApiEndPoint, reqContent);
        let returnContent = await rawResponse.json();
        if (returnContent.status === 'Error') {
            returnVal =returnContent.ErrorMsg;
        }
        else {
            console.log(returnContent)
            returnVal = "Purchase was put on market"
        }

        return new Promise<string>((resolve) => { resolve(returnVal) });
    }
    public async addNewUser():Promise<string>{
        //let returnMsg:Promise<string>;
        let returnVal: string;
        let rawResponse = await fetch(this.apiUrlEndPoint + "addbuyer/", this.getMethodCall);
        if (rawResponse.ok === true) {
            let jsonReturn = await rawResponse.json();
            returnVal=jsonReturn.status;
            return new Promise<string>((resolve) => { resolve(returnVal) });
        }
        else
            return new Promise<string>((resolve) => { resolve(rawResponse.statusText) });
    }
    public async registerNewAccount(newAccount: IRegisteredUser):Promise<string> {
        let returnVal: string;
        let reqContent = {
            method: 'POST',
            headers: { 'Content-type': 'application/json;charset=UTF-8' },
            body: JSON.stringify({
                "Name": newAccount.Name,
                "Username": newAccount.LoginName,
                "Address": newAccount.EthereumID,
                "Bio": newAccount.Bio,
                "Pic": newAccount.Pic,
            })
        }
        let createApiEndPoint = this.apiUrlEndPoint + 'adduser';
        let rawResponse = await fetch(createApiEndPoint, reqContent);
        let returnContent = await rawResponse.json();

        returnVal=returnContent.status;
            return new Promise<string>((resolve) => { resolve(returnVal) });
    }
    public async sendEscrowToContract(addressKey:string,escrowAmount:string){
        let reqContent = {
            method: 'POST',
            headers: { 'Content-type': 'application/json;charset=UTF-8' },
            body: JSON.stringify({
                "actPrivateKey": addressKey,
                "escrowAmount": escrowAmount
            })   
        }
        let createApiEndPoint = this.apiUrlEndPoint + 'sendEscrow';
        let rawResponse = await fetch(createApiEndPoint, reqContent);
        let returnContent = await rawResponse.json();
        return returnContent;
    }
}