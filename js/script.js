//global variables
//where profile information will appear
const profileOverview = document.querySelector (".overview");
const username = "Slipstitch";
//select unordered list to display the repos list
const reposList = document.querySelector (".repo-list");
//selects section with class of "repos" where all the repo info appears
const allRepoInfo = document.querySelector (".repos");
//selects section with class of "repo-data" where individual data appears
const repoIndivInfo = document.querySelector (".repo-data");


//Fetch API JSON data
const getUserInfo = async function () {
	const showRequest = await fetch (`http://api.github.com/users/${username}`);
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
       getRepos();
};

//Fetch the repos
const getRepos = async function () {
	const fetchRepos = await fetch (`http://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
	const repoData = await fetchRepos.json();
	displayRepoInfo(repoData);
	
};

//Display information about each repo
const displayRepoInfo = function (repos) {
	for (const repo of repos) {
		const repoItem = document.createElement ("li");
		repoItem.classList.add ("repo");
		repoItem.innerHTML = `<h3>${repo.name}</h3>`;
		reposList.append(repoItem);
	}
};

//Event Listener and handler for click on unordered list (class "repo-list")

reposList.addEventListener ("click", function (e) {
	if (e.target.matches("h3")) {
		const repoName = e.target.innerText;
		getRepoInfo(repoName);
	}

});

//function to get specific repo info
 
 const getRepoInfo = async function (repoName) {
 	const fetchRepoInfo = await fetch (`https://api.github.com/repos/${username}/${repoName}`);
    const repoInfo = await fetchRepoInfo.json();
    console.log(repoInfo); 

    //Grab languages
    const fetchLanguages = await fetch (repoInfo.languages_url);
    const languageData = await fetchLanguages.json();
    //console.log(languageData);

    //Make array of languages
    const languages = [];
    for (const language in languageData) {
    	languages.push(language);
    	//console.log(languages);
    }
    displaySpecificRepoInfo(repoInfo, languages);
 };

 //function to display specific repo info
 const displaySpecificRepoInfo = function (repoInfo, languages) {
 	repoIndivInfo.innerHTML = "";
 	const div = document.createElement("div");
 	div.innerHTML = `
 	<h3>Name: ${repoInfo.name}</h3>
 	<p>Description: ${repoInfo.description}</p>
 	<p>Default Branch: ${repoInfo.default_branch}</p>
 	<p>languages: ${languages.join(", ")}</p>
 	<a class="visit" href="${repoInfo.html_url}" target="_blank" rel="noreferrer noopener">View Repo on GitHub!</a>
 	`;

     repoIndivInfo.append(div);
     repoIndivInfo.classList.remove("hide");
     allRepoInfo.classList.add("hide");
     
 }; 