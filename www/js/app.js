// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic']).run(function($ionicPlatform) {
	$ionicPlatform.ready(function() {
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		if (window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}
		if (window.StatusBar) {
			StatusBar.styleDefault();
		}
	});
})
.factory('dataFactory', function() {
	var data = {
		players:[],
		deals:[]
	}
	
	return data;

})
.controller("PlayersListCtrl", function($scope, $state) {
	$scope.form_players_list = function(players_number) {
		$state.go("players_names",{players_number:players_number});
	}
})
.controller("PlayersNamesCtrl", function($scope, $state, $stateParams, dataFactory) {
	$scope.players_number = $stateParams.players_number;
	var names = [];
	for(var i=0; i<$scope.players_number; i++){
		names[i] = {'name':'Joueur'+(i+1)};
	}
	$scope.names = names;
	$scope.deals = [];
	
	$scope.form_players_names= function(names) {
	
	for(var i = 0; i < names.length; i++){
		names[i] = names[i].name;
		dataFactory.players.push(names[i]);
	}
		$state.go("deals");
	}
})
.controller("DealsCtrl", function($scope, $state, $stateParams, dataFactory) {
	$scope.data = dataFactory;
	//$scope.players = dataFactory.players;
	//$scope.deals = dataFactory.deals;
	//$scope.supp = $stateParams.supp;
	
	$scope.form_deals= function() {
		$state.go("deal",{players:JSON.stringify(dataFactory.players), deals:dataFactory.deals.length});
	}
	
	$scope.compute_totals= function() {
		$scope.totals = Array.apply(null, Array(dataFactory.players.length)).map(Number.prototype.valueOf,0);
		if(dataFactory.deals != undefined && dataFactory.deals.length > 0){
			for(var i = 0; i < dataFactory.deals.length; i++){
				for(var k = 0; k < dataFactory.deals[i].score.length; k++){
					$scope.totals[k] += dataFactory.deals[i].score[k].score;
				}
			}
		}
		console.log($scope.totals);
	}
	$scope.removeRow = function(args){	
		dataFactory.deals.splice( args, 1 );
		$scope.compute_totals();		
	};
	$scope.editRow = function(args){	
		$state.go("deal",{deals:args, action:'edit'});	
	};
	
	$scope.save = function(args){	
		var parties = JSON.parse(localStorage.getItem('parties'));	
		var current = JSON.parse(sessionStorage.getItem('party'));
		var party = parties[current];
		party.players = dataFactory.players;
		party.deals = dataFactory.deals;
		
		parties.splice(current, 1, party);
		console.log("--- modification de la sauvegarde ---");
		console.log(party);
		var JSONString = JSON.stringify(parties);
		localStorage.setItem('parties', JSONString)		
	};
	$scope.compute_totals();

})
.controller("DealCtrl", function($scope, $state, $stateParams, dataFactory) {
	$scope.players = dataFactory.players;
	$scope.deals = dataFactory.deals;
	$scope.edit = $stateParams.deals;
	$scope.action = $stateParams.action;
	$scope.attackScore = '';
	
	
	$scope.games = [
		{'name' : 'Petite', 'score' : 10, checked:true},
		{'name' : 'Pouce', 'score' : 20, checked:false},
		{'name' : 'Garde', 'score' : 40, checked:false},
		{'name' : 'Garde Sans', 'score' : 80, checked:false},
		{'name' : 'Garde Contre', 'score' : 160, checked:false}
		];
	
	$scope.oudlers = [
		{'value' : '0', 'checked' : true, 'todo':56},
		{'value' : '1', 'checked' : false, 'todo':51},
		{'value' : '2', 'checked' : false, 'todo':41},
		{'value' : '3', 'checked' : false, 'todo':36}
		];
		
	$scope.lastOudler = [
		{value:'Aucun', checked:true}, 
		{value:'Attaque', checked:false}, 
		{value:'Défense', checked:false}
		];
	$scope.handle = [
		{value:'Aucun', checked:true}, 
		{value:'Attaque', checked:false}, 
		{value:'Défense', checked:false}
		];
	$scope.handleValues = [
		{name:'Simple', checked:true, value:10}, 
		{name:'Double', checked:false, value:20}, 
		{name:'Triple', checked:false, value:30}
		];
	
	//définition des constantes
	$scope.playersInDeal = [];
	$scope.playersInDeal_supp = [];
	$scope.support = false;
	if($scope.players.length >= 5){
		$scope.support = true;
	}
	
	// constrction des checkboxes
	for(var i = 0; i < $scope.players.length; i++){
		if(i == 0){
			$scope.playersInDeal[i] = {'text' : $scope.players[i], 'checked' : true, 'score':0, 'dealer':false, 'supp':false};
		} else $scope.playersInDeal[i] = {'text' : $scope.players[i], 'checked' : false, 'score':0, 'dealer':false, 'supp':false};
	}
	if($scope.players.length > 4){
		for(var i = 0; i < $scope.players.length; i++){
			if(i == 0){
				$scope.playersInDeal_supp[i] = {'text' : $scope.players[i], 'checked' : true, 'score':0, 'dealer':false, 'supp':false}
			} else $scope.playersInDeal_supp[i] = {'text' : $scope.players[i], 'checked' : false, 'score':0, 'dealer':false, 'supp':false};
		}
	}
	
	//affectation du dealer
	//var dealer = 0;
	if($scope.deals.length < $scope.players.length){
		dealer = $scope.deals.length;
		$scope.playersInDeal[dealer].dealer = true;
	} else {
		dealer = $scope.deals.length - ($scope.players.length * Math.trunc($scope.deals.length / $scope.players.length));
		$scope.playersInDeal[dealer].dealer = true;
	}
	
	//configuration des checkboxes pour utilisation radio
	$scope.resetPlayerInDeal = function(args){	
		for(var i = 0; i < $scope.players.length; i++){
			if(i != args){
				$scope.playersInDeal[i].checked = false
			}
		}		
	};
	$scope.resetPlayerInDeal_supp = function(args){	
		for(var i = 0; i < $scope.players.length; i++){
			if(i != args){
				$scope.playersInDeal_supp[i].checked = false
			}
		}		
	};
	$scope.resetOudlers = function(args){	
		for(var i = 0; i < $scope.oudlers.length; i++){
			if(i != args){
				$scope.oudlers[i].checked = false;
			}
		}		
	};
	$scope.resetLastOudler = function(args){	
		for(var i = 0; i < $scope.lastOudler.length; i++){
			if(i != args){
				$scope.lastOudler[i].checked = false;
			}
		}		
	};
	$scope.resetHandle = function(args){	
		for(var i = 0; i < $scope.handle.length; i++){
			if(i != args){
				$scope.handle[i].checked = false;
			}
		}		
	};
	$scope.resetGames = function(args){	
		for(var i = 0; i < $scope.games.length; i++){
			if(i != args){
				$scope.games[i].checked = false;
			}
		}		
	};
	$scope.resetHandleValues = function(args){	
		for(var i = 0; i < $scope.handleValues.length; i++){
			if(i != args){
				$scope.handleValues[i].checked = false;
			}
		}		
	};
	$scope.setDefenseScore = function() {
		$scope.attackScore = this.attackScore;
            $scope.defenseScore = (91-parseFloat($scope.attackScore));
    }
	$scope.setAttackScore = function() {
		$scope.defenseScore = this.defenseScore;
            $scope.attackScore = (91-parseFloat($scope.defenseScore));
    }
    
	//validation du formulaire
	$scope.form_deal= function(players, score, supp, oudlers, lastOudler, handle, attackScore, defenseScore, games, handleValues) {
	if(attackScore != undefined){
		attackScore = attackScore;
	} else if(defenseScore != undefined){
		attackScore = 91 - defenseScore;
	};
	
	var base_score = 0;
	for(var i = 0; i < oudlers.length; i++){
		if(games[i].checked){
			base_score = games[i].score;
		}
	}
	for(var i = 0; i < oudlers.length; i++){
		if(oudlers[i].checked){
			if(attackScore >= oudlers[i].todo){
				score = parseFloat(base_score) + Math.round(Math.trunc(parseFloat(attackScore) - parseFloat(oudlers[i].todo))/10)*10;
			} else   score = (parseFloat(base_score) + Math.round(Math.trunc(Math.abs(parseFloat(attackScore) - parseFloat(oudlers[i].todo)))/10)*10) * (- 1);
			for(var j = 0; j < lastOudler.length; j++){
					if(lastOudler[j].checked){
						if(lastOudler[j].value == 'Attaque'){
							score +=10;
						} else if(lastOudler[j].value == 'Défense'){
							score -=10;
						} 
					}
				}
			for(var j = 0; j < handle.length; j++){
				if(handle[j].checked){
					if(handle[j].value == 'Attaque'){
						for(var k = 0; k < handleValues.length; k++){
							if(handleValues[k].checked){
								score += handleValues[k].value;
							}
						}
					} else if(handle[j].value == 'Défense'){
						for(var k = 0; k < handleValues.length; k++){
							if(handleValues[k].checked){
								score -= handleValues[k].value;
							}
						}
					} 
				}
			}
		}
	}
	//console.log(oudlers);
	
	
	if(players.length < 5){
		for(var i = 0; i < players.length; i++){
			if(players[i].checked){
				var attack_score = parseFloat(score) * (players.length-1);
				players[i].score += attack_score;
			} else players[i].score = parseFloat(score)*-1;	
		}
	} else {
		for(var i = 0; i < players.length; i++){
			if(players[i].checked || supp[i].checked){
				if(players[i].checked == supp[i].checked){
					players[i].score = parseFloat(score) * 4;
					players[i].supp = true; 
				} else {
					if(players[i].checked){
						players[i].score = parseFloat(score) * 2;
					} else if(supp[i].checked) {
						players[i].score = parseFloat(score);
						players[i].supp = true;
					}
				}
			} else players[i].score = parseFloat(score)*-1;	
		}
	}
	dataFactory.deals.push({score : players, oudlers : oudlers, lastOudler : lastOudler, handle : handle, attackScore : attackScore, defenseScore : defenseScore, games : games, handleValues : handleValues});
	//$scope.deals.push({score : players});
		$state.go("deals");
	}
	
	if($scope.action == 'edit'){
		var test = 0;
		for(var i = 0; i < $scope.players.length; i++){
				if(dataFactory.deals[$scope.edit].score[i].checked){
					$scope.playersInDeal[i].checked = true;
				} else $scope.playersInDeal[i].checked = false;
				if($scope.players.length > 4){
					if(dataFactory.deals[$scope.edit].score[i].supp){
						$scope.playersInDeal_supp[i].checked = true;
					} else $scope.playersInDeal_supp[i].checked = false;
				}
				$scope.playersInDeal[i].dealer = dataFactory.deals[$scope.edit].score[i].dealer;
				test = Math.min(test, dataFactory.deals[$scope.edit].score[i].score);
				
		}
		for(var i = 0; i < dataFactory.deals[$scope.edit].oudlers.length; i++){
			if(dataFactory.deals[$scope.edit].oudlers[i].checked){
					$scope.oudlers[i].checked = true;
				} else $scope.oudlers[i].checked = false;
		}
		for(var i = 0; i < dataFactory.deals[$scope.edit].lastOudler.length; i++){
			if(dataFactory.deals[$scope.edit].lastOudler[i].checked){
					$scope.lastOudler[i].checked = true;
				} else $scope.lastOudler[i].checked = false;
		}
		for(var i = 0; i < dataFactory.deals[$scope.edit].handle.length; i++){
			if(dataFactory.deals[$scope.edit].handle[i].checked){
					$scope.handle[i].checked = true;
				} else $scope.handle[i].checked = false;
		}
		for(var i = 0; i < dataFactory.deals[$scope.edit].handleValues.length; i++){
			if(dataFactory.deals[$scope.edit].handleValues[i].checked){
					$scope.handleValues[i].checked = true;
				} else $scope.handleValues[i].checked = false;
		}
		for(var i = 0; i < dataFactory.deals[$scope.edit].games.length; i++){
			if(dataFactory.deals[$scope.edit].games[i].checked){
					$scope.games[i].checked = true;
				} else $scope.games[i].checked = false;
		}

		$scope.attackScore = dataFactory.deals[$scope.edit].attackScore;
		$scope.defenseScore = dataFactory.deals[$scope.edit].defenseScore;
		
		
		$scope.score = test * (-1);
		
		$scope.deals.splice( $scope.edit, 1 );
	}
})
.controller("HomeCtrl", function($scope, $state, dataFactory) {
	$scope.set_party = function() {
		if(localStorage.getItem('parties') == undefined){
			dataFactory.players.length = 0;
			dataFactory.deals.length = 0;
			
			var party = {
				name:'name',
				date : Date(),
				players : dataFactory.players,
				deals : dataFactory.deals,
			}
			var parties = [];
			parties.push(party);
			var JSONString = JSON.stringify(parties);
			console.log("--- Affichage de linitialisation ---");
			console.log(JSONString);
			localStorage.setItem('parties', JSONString);
			sessionStorage.setItem('party', 0);
			
		} else {
			dataFactory.players.length = 0;
			dataFactory.deals.length = 0;
			var party = {
				name:'name',
				date : Date(),
				players : dataFactory.players,
				deals : dataFactory.deals,
			}
			var parties = JSON.parse(localStorage.getItem('parties'));
			parties.push(party);
			var JSONString = JSON.stringify(parties);
			//console.log(JSONString);
			localStorage.setItem('parties', JSONString);
			var current = parties.length - 1;
			sessionStorage.setItem('party', current);
		
		}
		$state.go("players_list");
	}
	
	if(localStorage.getItem('parties') != undefined){
		$scope.parties = JSON.parse(localStorage.getItem('parties'));
	}
	
  $scope.data = {
    showDelete: false
  };
  
  $scope.edit = function(item) {
    alert('Edit Item: ');
  };
  $scope.share = function(item) {
    alert('Share Item: ');
  };
  $scope.show = function(item, index) {
    var current = index - 1;
    sessionStorage.setItem('party', current);
    var parties = JSON.parse(localStorage.getItem('parties'));
    var party = parties[current];
    console.log("--- Party à afficher ---");
    console.log(party);
	dataFactory.players = party.players;
	dataFactory.deals = party.deals;
	console.log("--- dataFactory --");
	console.log(dataFactory);
	$state.go("deals");
  };
  
  $scope.moveItem = function(item, fromIndex, toIndex) {
    $scope.parties.splice(fromIndex, 1);
    $scope.parties.splice(toIndex, 0, item);
  };
  
  $scope.onItemDelete = function(item, index) {
  	var current = index - 1;
    $scope.parties.splice($scope.parties.indexOf(item), 1);
    
    var parties = JSON.parse(localStorage.getItem('parties'));
    parties.splice(current, 1);
    var JSONString = JSON.stringify(parties);
    localStorage.setItem('parties', JSONString);
    
  };
})
.config(function($stateProvider, $urlRouterProvider) {
	//
	// For any unmatched url, redirect to /state1
	$urlRouterProvider.otherwise("/home");
	//
	// Now set up the states
	$stateProvider.state('home', {
		url : "/home",
		templateUrl : "templates/home.html",
		controller : "HomeCtrl"
	}).state('about', {
		url : "/about",
		templateUrl : "templates/about.html",
	}).state('players_list', {
		url : "/players_list",
		templateUrl : "templates/players_list.html",
		controller : "PlayersListCtrl"
	}).state('players_names', {
		url : "/players_names/:players_number",
		templateUrl : "templates/players_names.html",
		controller : "PlayersNamesCtrl"
	}).state('deals', {
		url : "/deals/",
		templateUrl : "templates/deals.html",
		controller : "DealsCtrl"
	}).state('deal', {
		url : "/deal/:deals/:action",
		templateUrl : "templates/deal.html",
		controller : "DealCtrl"
	})
});
