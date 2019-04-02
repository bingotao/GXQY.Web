import { Component } from 'react';
import Link from 'umi/link';
import { Route, Redirect } from 'react-router-dom';

class Home extends Component {
  render() {
    return (
      <div>
        Home
        <Link to="/home/sub1">Sub1</Link>
        <Link to="/home/sub2">Sub2</Link>
        {/* <Route /> */}
      </div>
    );
  }
}

export default Home;
