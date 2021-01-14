// Get modal element
const modal = document.getElementById('simpleModal');
// Get open modal button
const modalBtn = document.getElementById('modalBtn');
// Get close button
const closeBtn = document.getElementsByClassName('closeBtn')[0];
// Get next button
const nextBtn = document.getElementById('nextBtn');
// Select modal container
const modalContainer = document.querySelector('.modal-container');
// Select calculation section
const calculationContainer = document.querySelector('.calculation-container');
// Select table section
const tableContainer = document.querySelector('.table-container');

1. /* Modal section */

// Listen for click
modalBtn.addEventListener('click', ()=>{
	modal.style.display = 'block';
})

// Listen for close click
closeBtn.addEventListener('click', ()=>{
	modal.style.display = 'none';
})

// Listen for outside click
window.addEventListener('click', (event)=>{
	if(event.target == modal){
		modal.style.display = 'none';
	}
})

2. /* Calculation section */

nextBtn.addEventListener('click',()=>{
	modalContainer.style.display = 'none';
	calculationContainer.style.display = 'grid';
})

document.getElementById('calculateButton').addEventListener('click', (event)=>{
	event.preventDefault();
	const value = parseFloat(document.getElementById('value').value).toFixed(2);
	const price = parseFloat(document.getElementById('price').value).toFixed(2);
	document.getElementById('PDV').innerHTML = `
		<div class="form-group">
			<label for="PDV">ПДВ</label>
			<input type="number" class="form-control" value=${price * .2}>
			<small class="form-text text-muted">ПДВ = 20%</small>
		</div>`
	let result = (value - price - price*.2).toFixed(2);
	let restOfResult = Array.from(result).join('').split('.');
	const rest = new Map();
	let arrOfRest=[];
	rest.set(0, `${restOfResult[1]}`);
	rest.forEach((value, key) => {
		if (value - 50 > 0) {
			rest.set(key + 1, 50)
			restOfResult[1] = restOfResult[1] - 50;
		} else if (restOfResult - 25 > 0) {
			rest.set(key + 1, 25)
			restOfResult[1] = restOfResult[1] - 25;
		} else if (restOfResult[1] - 10 > 0) {
			rest.set(key + 1, 10)
			restOfResult[1] = restOfResult[1] - 10;
		} else if (restOfResult[1] - 5 > 0) {
			rest.set(key + 1, 5)
			restOfResult[1] = restOfResult[1] - 5;
		} else if (restOfResult[1] - 1 >= 0) {
			rest.set(key + 1, 1)
			restOfResult[1] = restOfResult[1] - 1;
		}
	})
	for (let items of rest.values()){
		arrOfRest.push(items);
	}
	arrOfRest.splice(0,1);
	if (value == 'NaN' || price == 'NaN'){
	error.innerHTML = `
	<div class="alert alert-danger notValid" role="alert">
	Введіть коректні дані<br/>
	Дякую, за розуміння!
	</div>`
	setTimeout(() => document.querySelector('.notValid').remove(),3000)
	}
	else if (result < 0)
	{document.getElementById('value').style.border ='0.1rem solid red';
	error.innerHTML=`
	<div class="alert alert-danger" role="alert">
	Внесена вами сума нижча за ціну товарів на<br/>
	<h1><strong>${result}<strong>  грн.</h1>
	Внесіть додаткові гроші або відмінусуйте товар.<br/>
	Дякую, за розуміння!
	</div>`}
	else if (value != 'NaN' || price != 'NaN'){
		document.getElementById('value').style.border = '0.1rem solid #ced4da';
		error.remove();
		document.getElementById('restOF').innerHTML = `
		<div class="card" style="width: 18rem;">
		<ul class="list-group list-group-flush">
		<li class="list-group-item">Сума, внесених вам коштів становила <br/>${value}</li>
		<li class="list-group-item">Сума, товарів обраних вами становила <br/>${price}</li>
		<li class="list-group-item">Ваша решта, становить ${restOfResult[0]}грн. i ${arrOfRest.map((item)=>`${item}коп.`)}</li>
		<li class="list-group-item">ПДВ 20% = ${price * .2}</li>
		</ul>
		</div>`
	}
})

3. /* Table of information */

document.getElementById('lastBtn').addEventListener('click',()=>{
	modalContainer.style.display = 'none';
	calculationContainer.style.display = 'none';
	tableContainer.style.display = 'block';
})

// User Class
class User {
	constructor(name,surname,email){
		this.name=name;
		this.surname=surname;
		this.email=email;
	}
}

// UI Class: Handle UI Tasks
class UI {
	static displayUsers() {
		const users = Store.getUsers();
		users.forEach(item=> UI.addUser(item));
	}
	// Add User
	static addUser(user){
		const tableData = document.getElementById('tableData');
		const row = document.createElement('tr');
		let now = new Date();
		row.innerHTML=`
			<input type="checkbox" class="form-check-input" id="changeUserData">
			<td>${now.getDate()}.${now.getMonth()}.${now.getFullYear()}<br/>
			${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}</td>
			<td>${user.name}</td>
			<td>${user.surname}</td>
			<td>${user.email}</td>
			<td class="d-table"><span class="closeBtn">&times;</span></td>
		`;
		tableData.appendChild(row);
	}
	// Delete User
	static deleteUser(el){
		if (el.classList.contains('closeBtn')){
			el.parentElement.parentElement.remove();
		}
	}
	static showAlert(message, className) {
		const div = document.createElement('div');
		div.className = `alert alert-${className}`;
		div.appendChild(document.createTextNode(message));
		const container = document.querySelector('.createUserData');
		const form = document.getElementById('userForm');
		container.insertBefore(div, form);
		setTimeout(()=>document.querySelector('.alert').remove(),3000);
	}
	// Clear fields
	static clearFields(){
		document.getElementById('name').value='';
		document.getElementById('surname').value='';
		document.getElementById('email').value='';
	}
}

// Store Class: Handles Storage
class Store{
	// Get the data from Storage
	static getUsers() {
		let users;
		if(localStorage.getItem('users')===null){
			users=[]
		} else {
			users = JSON.parse(localStorage.getItem('users'))
		}
		return users;
	}
	// Add User to Storage
	static addUserStorage(user){
		const users = Store.getUsers();
		users.push(user);
		localStorage.setItem('users',JSON.stringify(users));
	}
	// Remove from there
	static removeUserStorage(email){
		const users = Store.getUsers();
		users.forEach((user,index)=>{
			if(user.email===email){
				users.splice(index,1)
			}
		});
		localStorage.setItem('users', JSON.stringify(users))
	}
}

// Event: Display Users
document.addEventListener('DOMContentLoaded', UI.displayUsers);

// Event: Add a User
document.querySelector('#userForm').addEventListener('submit',(event)=>{
	event.preventDefault();

	const name = document.getElementById('name').value;
	const surname = document.getElementById('surname').value;
	const email = document.getElementById('email').value;

	if(name ==='' || surname==='' || email===''){
		UI.showAlert('Будь-ласка введіть дані','danger');
	} else {
		const user = new User(name,surname,email);
		UI.addUser(user);
		Store.addUserStorage(user);
		UI.showAlert('Користувач доданий', 'success');
		UI.clearFields();
	}
})

document.getElementById('tableData').addEventListener('change',(event)=>{
	if (event.target.className == 'form-check-input') {
		document.getElementById('name').value = event.target.nextElementSibling.nextElementSibling.textContent;
		document.getElementById('surname').value = event.target.nextElementSibling.nextElementSibling.nextElementSibling.textContent;
		document.getElementById('email').value = event.target.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.textContent;
	}
	setTimeout(()=>UI.clearFields(),10000);
})

//Event: Remove a User
document.getElementById('tableData').addEventListener('click',(event)=>{
	if(event.target.className!='form-check-input'){
		UI.deleteUser(event.target);
		Store.removeUserStorage(event.target.parentElement.previousElementSibling.textContent)
		UI.showAlert('Користувач видалений', 'success');
}})

var x =1;
var ostap = 'molodec'
