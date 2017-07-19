var React = require('react');
var PropTypes = require('prop-types');
var api = require('../utils/api'); //AJAX
var Loading = require('./Loading'); 

function SelectedLanguage (props){ // Stateless component -> doesnt have any state
       var languages = ['All', 'JavaScript', 'Ruby', 'Java', 'CSS', 'Python'];
return ( 
          <ul className="languages">
        {languages.map(function(lang){
        return ( // key = {} -> adds unique key to the array elements
            <li 
                style = {lang === this.props.selectedLanguage ? {color: '#d0021b'}:null} //Change the style of selected element
                onClick = {this.props.onSelect.bind(null, lang)}
                key={lang}>
                {lang}
            </li>
            )})}
        </ul>   
        )
    }

function RepoGrid (props){
    return (
        <ul className = 'popular-list'>
        {props.repos.map(function(repo, index){
            return (
                <li key={repo.name} className='popular-item'>
            <div className='popular-rank'>#{index + 1}</div>
            <ul className='space-list-items'>
                <li>
                    <img
                        className='avatar'
                        src={repo.owner.avatar_url}
                        alt={'Avatar for ' + repo.owner.login}/>
                </li>
                <li><a href={repo.html_url}>{repo.name}></a></li>
                <li>@{repo.owner.login}</li>
                <li>{repo.stargazers_count} stars</li>
            </ul>
            </li>
            )
        })}
        </ul>
    )
}

RepoGrid.PropTypes = {
    repos: PropTypes.array.isRequired,
}

SelectLanguage.PropTypes = {
    selectedLanguage: PropTypes.string.isRequired,
    onSelect: PropTypes.func.isRequired
}



class Popular extends React.Component  {
    constructor (props) {
        super(props);
        this.state = {
        selectedLanguage = 'All' // Default state
        };
        this.updateLanguage = this.updateLanguage.bind(this); // To change language selectors
    }

componentDidMount () {
    //AJAX -> where you do ajax requests
   this.updateLanguage(this.state.selectedLanguage);
}

    updateLanguage(lang){ // To update state and selector of languages
        this.setState(function (){
            return { 
                selectedLanguage: lang,
                repos: null // to fetch the repos
            }
            
        });
         api.fetchPopularRepos (lang) // Get the repos when button is clicked
    .then(function(repos){
            this.setState(function(){
                return {
                    repos: repos
                }
            },bind(this)) // makes this the same as the outside function this
    }) 
    }
    render(){
    return (
       <div>
        <SelectLanguage
            selectedLanguage = {this.state.selectedLanguage}
            onSelect = {this.updateLanguage}
        />
        {!this.state.repos //Grelha só aparece depois de carregada. Até lá aparece loading
        ? <Loading />
        : <RepoGrid repos={this.state.repos}/>}
        </div>
        )
    }
}
module.exports = Popular;