Parse.Cloud.beforeSave("Score", (request, response) => {
  if (request.object.get("score") % 2 == 0) {
    request.object.set("isEvenNumber", true);
  } else{
    request.object.set("isEvenNumber", false);
  }
  response.success();
});

Parse.Cloud.define("getUser", async (request) => {
  var query = new Parse.Query("User");
  query.equalTo("objectId", request.params.user)
  const results = await query.find()
  .then((results) => {
    console.log("results: "+ results.length);
    Response.success(results[0].get("username"));
  })
  .catch(() => {
    Response.error("Score failed")
  });
  return results;
});


Parse.Cloud.job("resetScore", (request) =>  {
  var query = new Parse.Query("Score");

  query.find({
    success: function(results){
      console.log("successfully retrieved " + results.length + "scores.");

      query.each(function(object, err){
        object.destroy({
          success: function(object){
            console.log("successfully destroyed object, ");
            Response.success();
          },
          error: function(error){
            console.log("error: "+ error.code +"="+ error.message);
            Response.error("Score lookup failed");
          }
        })
      })
    },
    error: function(error){
      console.log("error: "+ error.code +"="+ error.message);
      Response.error("Score lookup failed");
    }
    
  });
});



Parse.Cloud.define('hello', async (req, res) => {
  return 'world';
});