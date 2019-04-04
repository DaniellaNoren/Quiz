var url = "https://opentdb.com/api.php?amount=10&category=20&difficulty=easy&type=multiple";

var req = new XMLHttpRequest;
        var res = '';
        var listOfProducts = [];
        
        req.onreadystatechange = function(){
            if(req.readyState === 4){
                if(req.status === 200){
                    res = JSON.parse(req.responseText);
                    }else{
                    res = req.responseType;
                }
            }else{
                    console.log("bad "+req.status+" "+req.readyState);
            }
        }
        req.open('GET', url, true);

        req.send();
        listOfProducts.forEach(n => {
                    console.log(n);
        });

        console.log(res);