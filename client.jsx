const axios = require('axios');
const React = require('react');
const ReactDOM = require('react-dom');

const getApiUrl = () => {
  return `${window.location.protocol}//${window.location.host}`;
}

class Place extends React.Component {
  render(){
    return(
      <li>
        <b>{this.props.place}</b>,
        {this.props.address},
        {this.props.location},
      </li>
    )
  }
}

class PlaceList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: []
    };
  }

  componentDidMount() {
    this.update()
  }

  async update() {
    let url = getApiUrl() + '/history/'
    let { data } = await axios.get(url)
    this.setState({ data })
  }

  render() {
    return (
      <div>
        {
          this.state.data.map((item) => {
            let location = `${item.result.lat},${item.result.lng}`
            return (
              <Place place={item.address}
                address={item.result.formatted_address}
                location={location}
              />
            )
          })
        }
      </div>
    )
  }
}


class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      queryPlace: '',
    };
  }

  handleInputChange(event){
    this.setState({
      queryPlace: event.target.value
    })
  }

  async query() {
    let url = getApiUrl() + '/query-address/'
    let { data } = await axios.get(url, {
      params: {
        address: this.state.queryPlace,
      }
    })
    this.placeList.update()// <PlaceList ref=拿到實體 class PlaceList 所以可以呼叫更新
    console.log(data)
  }

  setPlaceList(placeList){
    this.placeList = placeList
  }

  render() {
    return (
      <div>
        <div className="ui large input">
          <input type="text" placeholder="search..."
            onChange={this.handleInputChange.bind(this)}>
          </input>
          <i className="search icon"></i>
          <button className="ui orange button" onClick={this.query.bind(this)}>
            search
          </button>
        </div>
        <PlaceList ref={this.setPlaceList.bind(this)} />
      </div>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)