//global variables
//where profile information will appear
const profileOverview = document.querySelector (".overview");
const username = "Slipstitch";
//select unordered list to display the repos list
const repoList = document.querySelector (".repo-list");
//selects section with class of "repos" where all the repo info appears
const allRepoInfo = document.querySelector (".repos");
//selects section with class of "repo-data" where individual data appears
const repoIndivInfo = document.querySelector (".repo-data");
//selects the Back to Repo Gallery button
const backButton = document.querySelector(".view-repos");
//selects the input with "Search by name" placeholder
const filterInput = document.querySelector(".filter-repos"); 


//Fetch API JSON data
const getUserInfo = async function () {
	const showRequest = await fetch (`https://api.github.com/users/${username}`);
	const data = await showRequest.json();
	//console.log(showRequest);
	displayUserInfo(data);
};

getUserInfo();

//Fetch and Display User Information
const displayUserInfo = function (data) {
	const div = document.createElement("div");
	div.classList.add("user-info");
	div.innerHTML = `
	   <figure>
         <img alt="user avatar" src=${data.avatar_url} />
       </figure>
       <div>
         <p><strong>Name:</strong> ${data.name}</p>
         <p><strong>Bio:</strong> ${data.bio}</p>
         <p><strong>Location:</strong> ${data.location}</p>
         <p><strong>Number of public repos:</strong> ${data.public_repos}</p>
       </div>`;
       profileOverview.append(div);
       getRepos(username);
};

//Fetch the repos
const getRepos = async function () {
	const fetchRepos = await fetch (`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
	const repoData = await fetchRepos.json();
	displayRepoInfo(repoData);
	
};

//Display information about each repo
const displayRepoInfo = function (repos) {
	// displays the input element ... search box
	filterInput.classList.remove("hide");
	for (const repo of repos) {
		const repoItem = document.createElement ("li");
		repoItem.classList.add ("repo");
		repoItem.innerHTML = `<h3>${repo.name}</h3>`;
		repoList.append(repoItem);
	}
};

//Event Listener and handler for click on unordered list (class "repo-list")

repoList.addEventListener ("click", function (e) {
	if (e.target.matches("h3")) {
		const repoName = e.target.innerText;
		getRepoInfo(repoName);
	}

});

//function to get specific repo info
 
 const getRepoInfo = async function (repoName) {
 	const fetchRepoInfo = await fetch (`https://api.github.com/repos/${username}/${repoName}`);
    const repoInfo = await fetchRepoInfo.json();
   
    //Grab languages
    const fetchLanguages = await fetch (repoInfo.languages_url);
    const languageData = await fetchLanguages.json();

    //Make array of languages
    const languages = [];
    for (const language in languageData) {
    	languages.push(language);
   }

    displaySpecificRepoInfo(repoInfo, languages);
 };

 //function to display specific repo info
 const displaySpecificRepoInfo = function (repoInfo, languages) {
 	backButton.classList.remove("hide");
 	repoIndivInfo.innerHTML = "";
 	repoIndivInfo.classList.remove("hide");
    allRepoInfo.classList.add("hide");    
 	
 	const div = document.createElement("div");
 	div.innerHTML = `
 	<h3>Name: ${repoInfo.name}</h3>
 	<p>Description: ${repoInfo.description}</p>
 	<p>Default Branch: ${repoInfo.default_branch}</p>
 	<p>languages: ${languages.join(", ")}</p>
 	<a class="visit" href="${repoInfo.html_url}" target="_blank" rel="noreferrer noopener">View Repo on GitHub!</a>
 	`;

     repoIndivInfo.append(div);
 }; 

 //click event to the back button ... make the repo disappear and go back to the complete list
backButton.addEventListener ("click", function () {
	allRepoInfo.classList.remove("hide");
	repoIndivInfo.classList.add("hide");
	backButton.classList.add("hide");
});


 //Dynamic search ... add input event to search box ...input box returns repos matching specific keyword in title
 
filterInput.addEventListener ("input", function (e) {
	const searchText = e.target.value;
	//console.log(searchText);
 	const repos = document.querySelectorAll(".repo");
 	const searchLowerText = searchText.toLowerCase();

 	for (const repo of repos) {
 		const repoLowerText = repo.innerText.toLowerCase();

 		if (repoLowerText.includes(searchLowerText)) {
 			repo.classList.remove("hide");
 		} else {
 			repo.classList.add("hide");
 		}
 	}

 });
