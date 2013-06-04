function encodeUrl(url){
	var encoded_url = url;
	encoded_url = encoded_url.replace(/#/g, "%23");
	encoded_url = encoded_url.replace(/>/g, "%3E");
	encoded_url = encoded_url.replace(/</g, "%3C");
	encoded_url = encoded_url.replace(/\+/g, "%2B");
/* 	encoded_url = encoded_url.replace(/&/g, "%26"); //careful: sometimes not wanted to escape this char */
	return encoded_url;
}

function decodeUrl(url){
	var decoded_url = url;
	decoded_url = decoded_url.replace(/%23/, "#");
	decoded_url = decoded_url.replace(/%3E/, ">");
	decoded_url = decoded_url.replace(/%3C/, "<");
	decoded_url = decoded_url.replace(/%2B/, "+");
	return decoded_url;
}

function isDigit(value) { 
 var b=true;
 var x=value+"";
 b=!!x.match(/^(([1-9][0-9]+|[0-9])(\.[0-9]+)?|\.[0-9]+|)$/);
 return b;
}

function formatNumber(value)
{
	alert("after:"+value.indexOf("."));
    var str = value.substring(0,value.indexOf(".") + 3);
	alert("before:"+str);
	break;
	return str;
}

/* Implement some sugar syntactic methods */
Array.prototype.remove = function(el){
	this.removeAt(this.indexOf(el));
}

Array.prototype.removeAt = function(index){
	if(index != -1) {
		this.splice(index, 1);
	}
}

Array.prototype.removeN = function(index, howmany){
	if(this.length >= index+howmany) {
		this.splice(index, howmany);
	}
}

Array.prototype.add = function(el){
	if(this.indexOf(el) == -1){
		this.push(el);
	}
}

Array.prototype.contains = function(el){
	return this.indexOf(el) != -1;
}

Array.prototype.toggle = function(el){
	if(this.indexOf(el) == -1){
		this.add(el);
	} else this.remove(el);
}

Backbone.Collection.prototype.clear = function(){
	this.each(function(model) { model.destroy(); });
}

function getColor(d) {
    return d > 1000 ? '#800026' :
           d > 500  ? '#BD0026' :
           d > 200  ? '#E31A1C' :
           d > 100  ? '#FC4E2A' :
           d > 50   ? '#FD8D3C' :
           d > 20   ? '#FEB24C' :
           d > 10   ? '#FED976' :
                      '#FFEDA0';
}

function HashTable()
{
	var size = 0;
	var entry = new Object(); 
  
	this.add = function (key , value)
    {
      if(!this.containsKey(key))
      {
         size ++ ;
      }
         entry[key] = value;
      }
	  
	 this.push = function (key , value)
    {

         size ++ ;
         entry[key] = value;
      }
 
      this.getValue = function (key)
     {
         return this.containsKey(key) ? entry[key] : null;
     }
 
         this.remove = function ( key )
     {
         if( this.containsKey(key) && ( delete entry[key] ) )
         {
             size --;
         }
     }
 
     this.containsKey = function ( key )
     {
         return (key in entry);
     }
 
     this.containsValue = function ( value )
     {
         for(var prop in entry)
         {
             if(entry[prop] == value)
             {
                 return true;
             }
         }
         return false;
     }
 
     this.getValues = function ()
     {
         var values = new Array();
         for(var prop in entry)
         {
             values.push(entry[prop]);
         }
         return values;
     }
 
     this.getKeys = function ()
     {
         var keys = new Array();
         for(var prop in entry)
         {
             keys.push(prop);
         }
             return keys;
     }
 
     this.getSize = function ()
    {
         return size;
     }

     this.clear = function ()
     {
         size = 0;
         entry = new Object();
     }
 }
/* End of sugar syntax */