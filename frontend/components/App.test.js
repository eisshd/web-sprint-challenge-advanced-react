import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react'
import AppFunctional from './AppFunctional'
import AppClass from './AppClass'


// Write your tests here
test("Renders without errors", ()=> {
  render(<AppClass/>);
  render(<AppFunctional/>)


});



