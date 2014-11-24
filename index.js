var Buffer = require('buffertools').Buffer;
var bitcore = require('bitcore');
var Key =  bitcore.Key;
var SINKey = bitcore.SINKey
var coinUtil = bitcore.util;


var authenticateApp = angular.module('requestApp', ['hc.marked']);

authenticateApp.config(['markedProvider', function(markedProvider) {
  markedProvider.setOptions({gfm: true});
}]);

var url = 'https://test.bitpay.com';

angular.element(document).ready(function() {



  angular.bootstrap(document, ['requestApp']);
});

var parameters = {
  bills: {
    POST: { secure: true, doc: "bills_post.md", params: [ { name: 'items' }, { name: "currency"} ] },
    GET: { secure: true, doc: "bills_get.md", params: [ { name: 'status' }]}
  },
  invoices: {
    GET: { secure: true, doc: "invoices_get.md", params: [ { name: 'status' }, { name: 'orderId' }, { name: 'itemCode' }, { name: "dateStart" }, { name: 'dateEnd' }, { name: 'limit' }, { name: 'skip' } ] },
    POST: { secure: true, doc: "invoices_post.md", params: [ { name: 'currency' }, { name: 'price' }, { name: 'orderId' }, { name: 'itemDesc' }, { name: 'itemCode' }] }
  },
  "invoices/:invoiceId": {
    GET: { secure: "optional", doc: "invoices_invoiceid_get.md", params: [] }
  },
  rates: {
    GET: { secure: false, doc: "rates_get.md", params: [] }
  },
  tokens: {
    POST: { secure: false, doc: "tokens_post.md", params: [ {name: 'id'}, {name: 'pairingCode'}, { name: 'facade' } ] }
  }
}

authenticateApp.controller('RequestCtrl', function($rootScope, $scope, $http) {

  $scope.parameters = [];
  $scope.privKey = "";
  $scope.pubKey = "";
  $scope.sin = "";
  $scope.resource = "";
  $scope.signature = "No key to sign with";
  $scope.signRequest = false;
  $scope.version = '2.0.0';
  $scope.methods = [];
  $scope.url = url;
  $scope.queryString = "";
  $scope.token = "";
  $scope.md = "#### Test";
  $scope.docs = "docs/landing.md";

  $scope.resources = Object.keys(parameters);

  $scope.updateMethods = function() {

    if(parameters[$scope.resource]) {
      $scope.methods = Object.keys(parameters[$scope.resource]);
    } else {
      return $scope.methods = [];
    }
  }

  $scope.updateSubresources = function() {
    var subsTmp = $scope.resource.split('/'),
      subs = [];
    for(var i = 0; i < subsTmp.length; i++) {
      if(subsTmp[i].charAt(0) == ':') {
        subs.push({ name: subsTmp[i], input: ""});
      }
    }
    console.log(subs);
    $scope.subresources = subs;
  }

  $scope.updateResolvedResource = function() {
    var resource = $scope.resource;
    var subresources = $scope.subresources;
    var resolvedResource = "";

    var subsTmp = $scope.resource.split('/'),
      subs = [],
      count = 0;

    for(var i = 0; i < subsTmp.length; i++) {
      if(subsTmp[i].charAt(0) == ':') {
        if(subresources[count]) {
          subsTmp[i] = subresources[count].input;
          count++;
        } else {
          subsTmp[i] = "";
        }
      }
    }

    for(var j = 0; j < subsTmp.length; j++) {
      resolvedResource += ( "/" + subsTmp[j]);
    }
    console.log(resolvedResource);
    $scope.resolvedResource = resolvedResource;
  }

  $scope.$watch('resource', $scope.updateMethods);
  $scope.$watch('resource', $scope.updateSubresources);
  $scope.$watch('resource', $scope.updateResolvedResource);
  $scope.$watch('subresources', $scope.updateResolvedResource, true);


  $scope.updateParameters = function() {
    var resource = $scope.resource;
    var method = $scope.method;

    if(parameters[resource] && parameters[resource][method]) {
      $scope.signRequest = parameters[resource][method].secure;
      $scope.parameters = parameters[resource][method].params
    } else {
      $scope.parameters = [];
    }
  }

  $scope.$watch('resource', $scope.updateParameters);
  $scope.$watch('method', $scope.updateParameters);

  $scope.getParameters = function(resource, method) {
    if(parameters[resource] && parameters[resource][method]) {
      $scope.parameters = parameters[resource][method].params
      $scope.signRequest = parameters[resource][method].secure;
      return $scope.parameters;
    } else {
      return [];
    }
  }

  $scope.generateKey = function() {
    var sk = new SINKey();
    sk.generate();
    var obj = sk.storeObj()
    $scope.privKey = obj.priv;
    $scope.pubKey = obj.pub;
    $scope.sin = obj.sin;
    $scope.SINKey = sk;
    $scope.updateSignature();
  }

  $scope.importKey = function() {
    try {
      var key = new Key();
      key.private = $scope.privKey;
      key.regenerateSync();
      $scope.pubKey = key.public.toString("hex");
      var sk = new SINKey({
        created: new Date(),
        privKey: key
      });

      var skObj = sk.storeObj();

      $scope.sin = skObj.sin;

      $scope.updateSignature();
    } catch(err) {
      console.log(err);
      return;
    }
  }

  $scope.updateQueryString = function() {
    var parameters = $scope.parameters,
      queryString = "";

    if($scope.token != "") {
      queryString += "token=" + $scope.token;
    }

    for(var i = 0; i < parameters.length; i++) {
      if(parameters[i].input && parameters[i].input != "") {
        if(queryString != "") {
          queryString += "&";
        }
        queryString += parameters[i].name + "=" + parameters[i].input;
      }
    }



    if($scope.method != "POST" && $scope.method != "PUT" && queryString != "") {
      $scope.queryString = "?" + queryString;
    } else {
      $scope.queryString = "";
    }
  }

  $scope.$watch('parameters', $scope.updateQueryString, true);
  $scope.$watch('method', $scope.updateQueryString);
  $scope.$watch('token', $scope.updateQueryString);


  $scope.updatePayloadToSign = function() {
    var parameters = $scope.parameters;
    var payload = {};

    if($scope.method != "POST" && $scope.method != "PUT") {
      $scope.payload = "";
      $scope.payloadToSign = url + $scope.resolvedResource + $scope.queryString;
      return;
    }

    for(var i = 0; i < parameters.length; i++) {
      if(parameters[i].input != "") {
        try {
          var j = JSON.parse(parameters[i].input);
          if(j) {
            payload[parameters[i].name] = j;
          }
        } catch(err) {
          payload[parameters[i].name] = parameters[i].input;
        }
      }
    }

    if($scope.token != "") {
      payload["token"] = $scope.token;
    }

    if(Object.keys(payload) == 0) {
      $scope.payload = "";
    } else {
      $scope.payload = JSON.stringify(payload);
    }

    $scope.payloadToSign = url + $scope.resolvedResource + $scope.payload;
    return $scope.payloadToSign;
  }

  $scope.$watch('method', $scope.updatePayloadToSign);
  $scope.$watch('token', $scope.updatePayloadToSign);
  $scope.$watch('resource', $scope.updatePayloadToSign);
  $scope.$watch('resolvedResource', $scope.updatePayloadToSign);
  $scope.$watch('queryString', $scope.updatePayloadToSign);

  $scope.$watch('parameters', $scope.updatePayloadToSign, true);



  $scope.updateSignature = function() {
    console.log($scope.payloadToSign);
    if($scope.privKey) {
      var hash = coinUtil.sha256($scope.payloadToSign);
      var key = new Key();
      console.log($scope.privKey);
      key.private = new Buffer($scope.privKey, "hex");

      $scope.signature = key.signSync(hash).toString('hex');
    } else {
      $scope.signature = "No key to sign with";
    }
  }

  $scope.$watch('parameters', $scope.updateSignature, true);
  $scope.$watch('payloadToSign', $scope.updateSignature);

  $scope.updateConfig = function() {
    $scope.config = {
      method: $scope.method,
      url: url + $scope.resolvedResource + $scope.queryString,
      headers: {
        "x-accept-version": $scope.version,
        "content-type": "application/json"
      },
      data: $scope.payload
    }

    if($scope.signRequest) {
      $scope.config.headers["x-identity"] = $scope.pubKey;
      $scope.config.headers["x-signature"] = $scope.signature;
    }
  }

  $scope.$watch('method', $scope.updateConfig);
  $scope.$watch('resource', $scope.updateConfig);
  $scope.$watch('version', $scope.updateConfig);
  $scope.$watch('payload', $scope.updateConfig);
  $scope.$watch('sin', $scope.updateConfig);
  $scope.$watch('signature', $scope.updateConfig);
  $scope.$watch('payloadToSign', $scope.updateConfig);
  $scope.$watch('subresources', $scope.updateConfig)

  $scope.updateDocs = function() {
    var resource = $scope.resource;
    var method = $scope.method;

    if(parameters[resource] && parameters[resource][method]) {
      $scope.docs = "docs/" + parameters[resource][method].doc;
    } else if($scope.docs == "docs/landing.md") {
      return;
    } else {
      $scope.docs =  "docs/nodocs.md";
    }
  }

  $scope.$watch('resource', $scope.updateDocs);
  $scope.$watch('method', $scope.updateDocs);

  $scope.submitRequest = function() {
/*    $scope.config = {
      method: $scope.method,
      url: url + '/' + $scope.resource,
      headers: {
        "x-accept-version": $scope.version,
        "content-type": "application/json"
      },
      data: $scope.payload
    }

    if($scope.signRequest) {
      config.headers["x-identity"] = $scope.sin;
      config.headers["x-signature"] = $scope.signature;
    }*/
    console.log($scope.config);
    console.log($scope.payloadToSign);
    $http($scope.config).then(function(res) {
      $scope.responseData = JSON.stringify(res.data, null, 2);
      $scope.responseStatus = res.status;
      $scope.responseStatusText = res.statusText;
    }, function(res) {
      $scope.responseData = JSON.stringify(res.data, null, 2);
      $scope.responseStatus = res.status;
      $scope.responseStatusText = res.statusText;
    });

  }

});

