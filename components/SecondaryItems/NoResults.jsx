import React from 'react';
import { Button } from 'antd';

const NoResults = ({ stopFiltering }) => (
  <div className="no-results">
    <div className="text">No data found</div>
    <Button type="primary" ghost className="link" onClick={stopFiltering}>
      Show all episodes instead
    </Button>
  </div>
);

export default NoResults;
