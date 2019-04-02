import { Component } from 'react';
import { Button, Input } from 'antd';
import st from './Test.less';

class Test extends Component {
    render() {
        console.log(this.props);
        return <div className={st.test}>
            <Input /><Button>Test</Button>
        </div>  
    }
}

export default Test;