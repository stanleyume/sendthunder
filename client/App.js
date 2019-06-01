import React, {Component} from 'react';
import { HTMLSelect, InputGroup, ControlGroup, FormGroup, Navbar, Alignment, Button } from '@blueprintjs/core';
import { AtSign, Send } from 'react-feather';
import { serverUrl } from './config';

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      thunders: [
        // 'Thunder with six packs',
        // 'Thunder with pot belly',
        // 'Thunder with gym subscription',
        // 'Thunder with anger issues',
        // 'Thunder doing press up',
        // 'Thunder from Mushin',
        // 'Thunder with Infinity gauntlet',
        // 'Thunder with mental problems',
        // 'Thunder wey smoke weed',
        // 'Thunder that took John Wick's crash course',
        // 'Thunder that works remotely',
        // 'Thunder with black belt'
      ],
      orders: []
    }

  }

  componentDidMount(){
      // Get Orders
      fetch('/api/orders', { headers: {'Content-Type':'application/json'} }).then(res => res.json()).then(orders => this.setState({orders: orders})).catch(e => console.log(e));
      // Get Thunders
      fetch('/api/thunders').then(response => response.json()).then(thunders => this.setState({thunders: thunders})).catch(e => console.log(e));
  }

  handleSubmit(event){
    event.preventDefault();
    const data = new FormData(event.target);
    let formData = {thunder_name: data.get('thunder'), recipient: data.get('recipient')};
    // console.log(formData);
    
    fetch('/api/orders', {method: 'POST', body: JSON.stringify(formData), headers: {"Content-Type":"application/json"}}).then(res => res.json()).then(order => {this.setState({orders: [...this.state.orders, order]})} ).catch(e => console.log(e));
  }

  createThunder(event){
    event.preventDefault();
    let data = new FormData(event.target);
    let formData = {name: data.get('name')};

    fetch('/api/thunders', {method: 'POST', body: JSON.stringify(formData), headers: {'Content-Type':'application/json'}}).then(res => res.json()).then(thunder => { this.setState({ thunders: [...this.state.thunders, thunder] }); }).catch(e => console.log(e));
  }

  render(){  

    return (<div style={{ width:'60%', textAlign: 'center', margin: '0 auto' }}>

    <h2>Send Thunder {process.env.API_HOST}</h2>
  
    <form onSubmit={this.handleSubmit.bind(this)} method="POST">

      <FormGroup label="Select Thunder">
        <HTMLSelect large fill name="thunder" options={this.state.thunders.map(a=>(a.name))}>
          {/* { this.state.thunders.map(thunder => `<option>${thunder.name}</option>`) } */}
        </HTMLSelect>
      </FormGroup>

      <FormGroup label="Recepient's Twitter"
          >
        <ControlGroup fill={true} vertical={false}>
            <Button style={{ maxWidth: '50px'  }}><AtSign/></Button>
            <InputGroup placeholder="umestanley" name="recipient" large/>
        </ControlGroup>
      </FormGroup>
      
      <br/>

      <Button intent="success" large type="submit">Send</Button>

    </form>

    <br/>
    
    {/* <form onSubmit={this.createThunder.bind(this)}>
      <InputGroup placeholder="Thunder title" name="name" large required/>
      <Button intent="success" large type="submit">Save</Button>
    </form> */}

    <ul>
      {this.state.orders.map((order, index) => { return <li key={index}>{order.thunder_name} > {order.recipient}</li>})}
    </ul>
  
  </div>);
  }
}

export default App;