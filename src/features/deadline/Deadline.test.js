import DeadlineView from "./Deadline"
import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../../app/store';

it(" opens a add from", () => {
    render(
        <Provider store={store}>
            <DeadlineView />
        </Provider>
    )

    expect(screen.getByText("Deadline")).toBeInTheDocument();

    const dialog = screen.getByTestId("addDialog");
    expect(dialog).toBeInTheDocument();
    
    expect(dialog).not.toBeVisible();
    const button = screen.getByTestId("openAddForm");
    fireEvent.click(button);
    expect(dialog).toBeVisible();
})
