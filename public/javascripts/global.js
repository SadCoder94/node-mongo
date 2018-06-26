var userlistData = [];

$(document).ready(function(){
	populateTable();
	$('#userList table tbody').on('click','td a.linkshowuser', showUserInfo);
});

function populateTable(){
	var tableContent = '';
	$.getJSON('/users/userlist',function(data){
		userListData = data;
		$.each(data,function(){
			tableContent+='<tr>';
			tableContent+='<td><a href="#" class="linkshowuser" rel="'+this.username+'">'+this.username+'</a></td>';
			tableContent+='<td>'+this.email+'</td>';
			tableContent+='<td><a href="#" class="linkdeleteuser" rel="'+this._id+'">delete</a></td>';
			tableContent+='</tr>';
		});
		
		$('#userList table tbody').html(tableContent);
	});
};

function showUserInfo(event){
	event.preventDefault();
	
	//get username from link rel att
	var thisUserName = $(this).attr('rel');
	
	//get index of object based on id value
	var arrayPosition = userListData.map(arrayItem => arrayItem.username).indexOf(thisUserName);
	
	var thisUserObject = userListData[arrayPosition];
	
	$('#userInfoName').text(thisUserObject.fullname);
	$('#userInfoAge').text(thisUserObject.age);
	$('#userInfoGender').text(thisUserObject.gender);
	$('#userInfoLocation').text(thisUserObject.location);
};

$('#btnAddUser').on('click',addUser);


function addUser(event){
	event.preventDefault();
	
	var errorCount =0;
	
	//check all fields are not blank else increment errorCount
	$('#addUser input').each(function(index, val){
		if($(this).val()== ''){errorCount++;}
	});
	
	if(errorCount==0)
	{
		var newUser = {
			'username':$('#addUser fieldset input#inputUserName').val(),
			'email':$('#addUser fieldset input#inputUserEmail').val(),
			'fullname':$('#addUser fieldset input#inputUserFullName').val(),
			'age':$('#addUser fieldset input#inputUserAge').val(),
			'location':$('#addUser fieldset input#inputUserLocation').val(),
			'gender':$('#addUser fieldset input#inputUserGender').val()
		}
		console.log('adding');
		//using ajax to post object to adduser service
		$.ajax({
			type: 'POST',
			data: newUser,
			url: '/users/adduser',
			dataType: 'JSON'
		}).done(function(response){
			if(response.msg === ''){
				$('#addUser fieldset input').val('');
				populateTable();
			}
			else{
				alert('Error:'+ response.msg);
			}
		});
	}
	else{
		alert('Please fill all fields');
		return false;
	}
};

$('#userList table tbody').on('click','td a.linkdeleteuser', deleteUser);

function deleteUser(event){
	event.preventDefault();
	var confirmation = confirm('Are you sure ?');
	
	if(confirmation == true){
		$.ajax({
			type: 'DELETE',
			url: '/users/deleteuser/'+ $(this).attr('rel')
		}).done(function(response){
			if(response === ''){
				return;
			}
			else{
				alert('Error: '+ response.msg);
			}
			console.log(response);
			populateTable();
		});
	}
	else{
		return false;
	}
};