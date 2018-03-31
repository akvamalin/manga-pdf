import * as React from 'react';
import { render } from 'react-dom';
import { Card, CardTitle, CardText } from 'react-toolbox/lib/card';

const HomePage = () => (
  <Card>
    <CardTitle title="Hello, World" />
    <CardText>Dummy text</CardText>
  </Card>
);

render(<HomePage />, document.getElementById('app'));
