import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from './app/store';
import App from './App';


it("renders Countdonw, ETA, Deadline", ()=>{
    render (
        <Provider store={store}>
        <App />
        </Provider> 
    )
    expect(screen.getByText("00")).toBeInTheDocument();
    expect(screen.getByText("ETA")).toBeInTheDocument();
    expect(screen.getByText("Deadline")).toBeInTheDocument();
})