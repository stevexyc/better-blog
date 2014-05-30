
articles = new Meteor.Collection("Articles");

Meteor.startup(function () {
	if (articles.find().count() === 0) {
		articles.insert({
			title: 'Hello Universe',
			slug: 'hello-universe',
			date: new Date(),
			text: "<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugit quidem repudiandae ipsum beatae. Tenetur, id, deserunt sunt sed dolorum soluta dicta aperiam quae hic molestias qui voluptates nostrum atque veritatis.</p><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur, quasi, sequi possimus temporibus distinctio vero id ab magni alias eius soluta dolorem nulla repudiandae pariatur eveniet quod at facilis maiores!</p>",
		});
		articles.insert({
			title: 'My Second Post',
			slug: 'my-second-post',
			date: new Date(),
			text: "<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam, beatae, ad, tenetur sequi aperiam eos provident similique molestiae dolores eum aliquid dolor dicta. Fugiat, expedita, facilis perspiciatis debitis magnam id!</p>",
		});
		articles.insert({
			title: 'The Future!!',
			slug: 'the-future',
			date: new Date(),
			text: "<p>write to your hearts content!</p>",
		});
	};
})

Meteor.publish("myarticles", function () {
  return articles.find({});
});

Meteor.publish("currentarticle", function (slug) {
  return articles.find({slug:slug});
});

Meteor.publish("articlelist", function () {
  return articles.find({},{fields: {title:1,slug:1,date:1}});
});

Meteor.methods({
  update: function (id, posttitle, posttext) {
    // check(id, String);
    // check(posttext, [String]);
    check(posttext, String);
    // .. do stuff ..
    articles.update({_id: id}, {$set: {
    	title: posttitle,
    	text: posttext
    }});
    if (false)
      throw new Meteor.Error(404, "Can't find my pants");
    return "success";
  },

  bar: function () {
    // .. do other stuff ..
    return "baz";
  }
});