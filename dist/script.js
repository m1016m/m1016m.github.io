var rooms=[
  {
    "name": "經濟雙人房",
    "eng": "Economy Double Room",
    "price": 7000,
    "amount": 0,
    "cover": "http://bosscode.monoame.com/20170323_vue_comp/img/room%20(1).jpg",
    "discount": 0.9,
    "equipment": {
      "wifi": false,
      "bathtub": true,
      "breakfast": true
    }
  },
  {
    "name": "海景三人房",
    "eng": "Sea view triple Room",
    "price": 7800,
    "amount": 0,
    "cover": "http://bosscode.monoame.com/20170323_vue_comp/img/room%20(2).jpg",
    "discount": 0.8,
    "equipment": {
      "wifi": true,
      "bathtub": true,
      "breakfast": false
    }
  },
  {
    "name": "典雅景觀房",
    "eng": "Elegant landscape Room",
    "price": 5400,
    "amount": 0,
    "cover": "http://bosscode.monoame.com/20170323_vue_comp/img/room%20(3).jpg",
    "discount": 0.85,
    "equipment": {
      "wifi": false,
      "bathtub": true,
      "breakfast": true
    }
  },
  {
    "name": "尊享豪華房",
    "eng": "Exclusive Deluxe Room",
    "price": 9800,
    "amount": 0,
    "cover": "http://bosscode.monoame.com/20170323_vue_comp/img/room%20(4).jpg",
    "discount": 0.8,
    "equipment": {
      "wifi": true,
      "bathtub": false,
      "breakfast": true
    }
  },
  {
    "name": "商務雙人房",
    "eng": "Business Double Room",
    "price": 5600,
    "amount": 0,
    "cover": "http://bosscode.monoame.com/20170323_vue_comp/img/room (5).jpg",
    "discount": 0.9,
    "equipment": {
      "wifi": true,
      "bathtub": false,
      "breakfast": false
    }
  },
  {
    "name": "溫泉雙人房",
    "eng": "Hot spring double Room",
    "price": 8400,
    "amount": 0,
    "cover": "http://bosscode.monoame.com/20170323_vue_comp/img/room (6).jpg",
    "discount": 0.6,
    "equipment": {
      "wifi": true,
      "bathtub": true,
      "breakfast": true
    }
  },
  {
    "name": "總統套房",
    "eng": "Presidential Suite",
    "price": 23000,
    "amount": 0,
    "cover": "http://bosscode.monoame.com/20170323_vue_comp/img/room (7).jpg",
    "discount": 0.75,
    "equipment": {
      "wifi": true,
      "bathtub": true,
      "breakfast": true
    }
  },
  {
    "name": "奢華四人房",
    "eng": "Luxury four Room",
    "price": 8500,
    "amount": 0,
    "cover": "http://bosscode.monoame.com/20170323_vue_comp/img/room (8).jpg",
    "discount": 0.7,
    "equipment": {
      "wifi": true,
      "bathtub": true,
      "breakfast": false
    }
  }
];

Vue.component("Room",{
  template: "#room",
  props: ["room_data","hotel_discount","hotel_tip","delete_room","id"],
  methods: {
    bg_css: function(url){
      return {
        "background-image": "url('"+url+"')",
        "background-color": "#555"
      };
    }
  },
  computed: {
    final_discount: function(){
      return this.room_data.discount*this.hotel_discount;
    },
    final_price: function(){
      return parseInt(this.room_data.price*this.final_discount+1.0*this.hotel_tip);
    }
  }
});

var vm = new Vue({
  el: "#app",
  data: {
    rooms: rooms,
    discount: 0.9,
    tip: 200
  },methods: {
    add_new_room: function(){
      this.rooms.push({
        name: "新房間",
        eng: "new room",
        equipment: {},
        cover: "",
        price: 0,
        discount: 1
      });
    },
    price_raise: function(delta){
      var vobj=this;
      this.rooms.forEach(function(obj){
        obj.price+=delta;
      });
    },
    delete_room: function(id){
      this.rooms.splice(id,1);
    }
  }
});