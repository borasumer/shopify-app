const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
require('dotenv').config();
var AWS = require("aws-sdk");

const {
    SHOPIFY_APP_HOST,
    SHOPIFY_API_KEY,
    SHOPIFY_API_PASSWORD,
    AWS_KEY_ID,
    AWS_ACCESS_KEY
} = process.env;

let awsConfig = {
    "region": "us-east-2",
    "endpoint": "http://dynamodb.us-east-2.amazonaws.com",
    "accessKeyId": "AKIAWNSRGJF2PN5NHX6C", "secretAccessKey": "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"
}
AWS.config.update(awsConfig);

let docClient = new AWS.DynamoDB.DocumentClient();

fetch('https://edd7fd7dac31cb81df28f91455649911:330c304080eb8a70845b94ad0269bc50@gointegrations-devtest.myshopify.com/admin/products.json')
    .then(response => response.json())
    .then(data => {
        data.products.map(product => {
            var input = {
                "id": product.id,
                "title": product.title,
                "body_html": product.body_html,
                "vendor": product.vendor,
                "price": product.variants[0].price,
                "image": product.images[0].src
            }
            save(input);
        })
    });

let save = function (input) {
    var params = {
        TableName: "products",
        Item: input
    };
    docClient.put(params, function (err, data) {
        if (err) {
            console.log(err)
        } else {
            console.log("succes")
        }
    })
}

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res, next) => {
    res.json({
        message: 'Razaors are sharp.'
    });
});


app.get('/products', (req, res, next) => {
    var params = {
        TableName: "products",
        ProjectionExpression: "id,title,body_html,vendor,price,image"
    };
    docClient.scan(params, onScan);

    function onScan(err, data) {
        if (err) {
            console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            // print all the movies
            console.log("Scan succeeded.");
            res.json(data);
        }
    }
});

const draftOrder = (req, res, next) => {

    var draft = {

        line_items: [
            {
                "variant_id": 'req.body.id',
                "quantity": '1',
                "title": 'req.body.title',
                "price": 'req.body.price * 0.75'
            }
        ]


    };

    console.log(typeof (draft.draft_order.line_items[0].variant_id));
    fetch('https://edd7fd7dac31cb81df28f91455649911:330c304080eb8a70845b94ad0269bc50@gointegrations-devtest.myshopify.com/admin/draft_orders.json', {
        method: 'POST',
        body: JSON.stringify(draft),
        headers: {
            'content-type': 'application/json'
        }
    }).then(response => response.json())
        .then(result => {
            res.send(result)
            console.log(result)
        })
}

app.post('/products', draftOrder);

app.listen(5000, () => {
    console.log('Listening on http://localhost:5000');
});