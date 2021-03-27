import styled from 'styled-components';


const Container = styled.div`
    width: 95%;
    max-width: 960px;
    margin: 1rem auto;
    display: flex;
    flex-wrap: warp;
    justify-content: center;
    @media (max-width: 600px){
        flex-direction: column;
    }
`;

const ComponentBox = styled.div`
	// padding: 1rem;
    // margin: 0 auto;
    // text-align: center;
    
`;

const Row = styled.div`
    display: flex;
    flex-direction: row;
`;


const MainColumn = styled.div`
    display: flex;
    flex-direction: column;
    background-color: blue;
    align-items: center;
    width: 70%;
    @media (max-width: 600px){
        width: 100%;
    }
`;

const Column = styled.div`
    display: flex;
    flex-direction: column;
    background-color: grey;
    align-items: center;
    width: 30%;
    @media (max-width: 600px){
        width: 100%;
    }
`;

export {MainColumn, Column, Row, Container, ComponentBox};