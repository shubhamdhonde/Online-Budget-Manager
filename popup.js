window.onload = function(){
  chrome.storage.sync.get('balanceVal',function(a1){
    if(a1.balanceVal == undefined || parseInt(a1.balanceVal)==NaN){
      var x = prompt("Set your maximum limit");
      chrome.storage.sync.set({"balanceVal":parseInt(x)});
      document.getElementById('balanceVal').innerHTML = parseInt(x);
      chrome.storage.sync.get('origAmt',function(a4){
        chrome.storage.sync.set({"origAmt":parseInt(x)});
      });
      chrome.storage.sync.get('limit',function(a5){
        chrome.storage.sync.set({"limit":parseInt(x)});
        document.getElementById('limit').innerHTML = parseInt(x);
      });
    }
    else{
      var x = parseInt(a1.balanceVal);
      document.getElementById('balanceVal').innerHTML = x;
      chrome.storage.sync.get("limit",function(a5){
        document.getElementById('limit').innerHTML = parseInt(a5.limit);
      });
      if(x<0){
        document.getElementById('balanceVal').innerHTML = -x;
        document.getElementById('balanceVal').style.color = "red";
      }
    }

  });
  document.getElementById('spend').addEventListener("click",spendMe);
  document.getElementById('reset').addEventListener("click",resetBal);
  document.getElementById('changelim').addEventListener("click",changeLim);
  function spendMe(){
    chrome.storage.sync.get('balanceVal',function(a2){
      var x = parseInt(a2.balanceVal);
      var y = parseInt(document.getElementById('spendings').value);
      if(y==undefined || y==0 || y==NaN){
        document.getElementById('forWrngIp').innerHTML = "Please enter a non-zero value";
        document.getElementById('forWrngIp').style.color = "red";
        document.getElementById('spendings').value = "";
        return;
      }
      else{
        document.getElementById('spendings').value = "";
        document.getElementById('forWrngIp').innerHTML = "";
        if(x>=y){
          chrome.storage.sync.set({"balanceVal":(x-y)});
          document.getElementById('balanceVal').innerHTML = parseInt(x-y);
          document.getElementById('balanceVal').style.color = "black";
          if(x==y) alert("Be careful you have reached your limit");
          return;
        }
        else{
          if(x>=0) alert("You are in debt now");
          chrome.storage.sync.set({"balanceVal":(x-y)});
          document.getElementById('balanceVal').innerHTML = y-x;
          document.getElementById('balanceVal').style.color = "red";
        }
      }
    });
  }
  function resetBal() {
    chrome.storage.sync.get('origAmt',function(a4){
      chrome.storage.sync.set({"balanceVal":parseInt(a4.origAmt)});
      document.getElementById('balanceVal').innerHTML = parseInt(a4.origAmt);
      document.getElementById('balanceVal').style.color = "black";
    });
  }
  function changeLim(){
    var x = parseInt(prompt("Enter New Limit"));
    if(x<=0){
      document.getElementById('forWrngIp').innerHTML = "*Enter positive value.";
      document.getElementById('forWrngIp').style.color = "red";
      return;
    }
    document.getElementById('forWrngIp').innerHTML = "";
      chrome.storage.sync.get("balanceVal",function(a2){
        var y = parseInt(a2.balanceVal);
        chrome.storage.sync.get("limit",function(a3){
          var z = parseInt(a3.limit);
          var newBal = y+(x-z);
          chrome.storage.sync.set({"origAmt":x});
          chrome.storage.sync.set({"limit":x});
          chrome.storage.sync.set({"balanceVal":newBal});
          document.getElementById('limit').innerHTML = x;
          document.getElementById('balanceVal').innerHTML = newBal;
          if(newBal >= 0){
            document.getElementById('balanceVal').style.color = "black";
          }
          else document.getElementById('balanceVal').style.color= "red";
        });
      });
  }



}
