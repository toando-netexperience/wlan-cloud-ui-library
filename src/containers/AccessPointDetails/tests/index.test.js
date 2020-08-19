import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { cleanup, fireEvent, waitForElement } from '@testing-library/react';
import { BrowserRouter as Router, Route, MemoryRouter } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { render } from 'tests/utils';
import { defaultProps, firmware } from './constants';
import AccessPointDetails from '..';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

const DOWN_ARROW = { keyCode: 40 };

describe('<AccessPointDetails />', () => {
  afterEach(() => {
    cleanup();
  });

  it('general tab should show the general form', async () => {
    const { getByRole, getByText } = render(
      <MemoryRouter initialEntries={['/network/access-points/1/general']}>
        <Route path="/network/access-points/:id/:tab">
          <AccessPointDetails {...defaultProps} />
        </Route>
      </MemoryRouter>
    );

    fireEvent.click(getByRole('tab', { name: /general/i }));

    const paragraph = getByText('Identity');
    expect(paragraph).toBeVisible();
  });

  it('status tab should show the status form', async () => {
    const data = { ...defaultProps, data: { ...defaultProps.data, alarmsCount: 1 } };
    const { getByRole, getByText } = render(
      <MemoryRouter initialEntries={['/network/access-points/1/general']}>
        <Route path="/network/access-points/:id/:tab">
          <AccessPointDetails {...data} />
        </Route>
      </MemoryRouter>
    );

    fireEvent.click(getByRole('tab', { name: /status/i }));

    const paragraph = getByText('Noise Floor');
    expect(paragraph).toBeVisible();
  });

  it('os tab should show the os form', async () => {
    const { getByRole, getByText } = render(
      <MemoryRouter initialEntries={['/network/access-points/1/general']}>
        <Route path="/network/access-points/:id/:tab">
          <AccessPointDetails {...defaultProps} />
        </Route>
      </MemoryRouter>
    );

    fireEvent.click(getByRole('tab', { name: /os/i }));

    const paragraph = getByText('Operating System Statistics');
    expect(paragraph).toBeVisible();
  });

  it('location tab should show the location form', async () => {
    const { getByRole, getByText } = render(
      <MemoryRouter initialEntries={['/network/access-points/1/general']}>
        <Route path="/network/access-points/:id/:tab">
          <AccessPointDetails {...defaultProps} />
        </Route>
      </MemoryRouter>
    );

    fireEvent.click(getByRole('tab', { name: /location/i }));
    const paragraph = getByText('City');
    expect(paragraph).toBeVisible();
  });

  it('firmware tab should show the firmware form', async () => {
    const { getByRole, getByText } = render(
      <MemoryRouter initialEntries={['/network/access-points/1/general']}>
        <Route path="/network/access-points/:id/:tab">
          <AccessPointDetails {...defaultProps} />
        </Route>
      </MemoryRouter>
    );

    fireEvent.click(getByRole('tab', { name: /firmware/i }));
    const paragraph = getByText('Upgrade');
    expect(paragraph).toBeVisible();
  });

  it('Confirm change tab form Modal should appear if tab form is changed without saving', () => {
    const { getByRole, getByPlaceholderText, getByText } = render(
      <MemoryRouter initialEntries={['/network/access-points/1/general']}>
        <Route path="/network/access-points/:id/:tab">
          <AccessPointDetails {...defaultProps} />
        </Route>
      </MemoryRouter>
    );

    fireEvent.click(getByRole('tab', { name: /general/i }));

    const paragraph = getByText('Identity');
    expect(paragraph).toBeVisible();

    fireEvent.change(getByPlaceholderText('Enter Access Point Name'), {
      target: { value: 'test' },
    });
    fireEvent.click(getByRole('tab', { name: /status/i }));
    expect(
      getByText('Please confirm exiting without saving this Access Point page.')
    ).toBeVisible();
    fireEvent.click(getByRole('button', { name: /cancel/i }));

    expect(paragraph).toBeVisible();

    fireEvent.change(getByPlaceholderText('Enter Access Point Name'), {
      target: { value: 'test' },
    });
  });

  it('Tab should change if user clicks Change on change tab modal ', () => {
    const { getByRole, getByPlaceholderText, getByText } = render(
      <MemoryRouter initialEntries={['/network/access-points/1/general']}>
        <Route path="/network/access-points/:id/:tab">
          <AccessPointDetails {...defaultProps} />
        </Route>
      </MemoryRouter>
    );
    fireEvent.click(getByRole('tab', { name: /general/i }));
    const generalParagraph = getByText('Identity');
    expect(generalParagraph).toBeVisible();

    fireEvent.change(getByPlaceholderText('Enter Access Point Name'), {
      target: { value: 'test' },
    });
    fireEvent.click(getByRole('tab', { name: /status/i }));
    expect(
      getByText('Please confirm exiting without saving this Access Point page.')
    ).toBeVisible();
    fireEvent.click(getByRole('button', { name: /ok/i }));

    const statusParagraph = getByText('Noise Floor');
    expect(statusParagraph).toBeVisible();
  });

  it('Confirm leave form Modal should appear if General tab form is changed', () => {
    const { getByRole, getByPlaceholderText, getByText } = render(
      <MemoryRouter initialEntries={['/network/access-points/1/general']}>
        <Route path="/network/access-points/:id/:tab">
          <AccessPointDetails {...defaultProps} firmware={firmware} />
        </Route>
      </MemoryRouter>
    );

    fireEvent.click(getByRole('tab', { name: /general/i }));

    fireEvent.change(getByPlaceholderText('Enter Access Point Name'), {
      target: { value: 'test' },
    });
    fireEvent.click(getByRole('button', { name: /back/i }));
    expect(
      getByText('Please confirm exiting without saving this Access Point page.')
    ).toBeVisible();
  });

  it('Confirm leave form Modal should appear if Location tab form is changed', async () => {
    const { getByRole, getByLabelText, getByText } = render(
      <MemoryRouter initialEntries={['/network/access-points/1/general']}>
        <Route path="/network/access-points/:id/:tab">
          <AccessPointDetails {...defaultProps} firmware={firmware} />
        </Route>
      </MemoryRouter>
    );

    fireEvent.click(getByRole('tab', { name: /location/i }));

    const city = getByLabelText('City');
    fireEvent.keyDown(city, DOWN_ARROW);
    await waitForElement(() => getByText(defaultProps.locations[1].name));
    fireEvent.click(getByText(defaultProps.locations[1].name));

    fireEvent.click(getByRole('button', { name: /back/i }));
    expect(
      getByText('Please confirm exiting without saving this Access Point page.')
    ).toBeVisible();

    fireEvent.click(getByRole('button', { name: /cancel/i }));
    fireEvent.keyDown(city, DOWN_ARROW);
    await waitForElement(() => getByText(defaultProps.locations[0].name));
    fireEvent.click(getByText(defaultProps.locations[0].name));
  });

  it('Confirm leave form Modal should appear if Firmware tab form is changed', async () => {
    const { getByRole, getByText } = render(
      <MemoryRouter initialEntries={['/network/access-points/1/general']}>
        <Route path="/network/access-points/:id/:tab">
          <AccessPointDetails {...defaultProps} firmware={firmware} />
        </Route>
      </MemoryRouter>
    );

    fireEvent.click(getByRole('tab', { name: /firmware/i }));
    const paragraph = getByText('Upgrade');
    expect(paragraph).toBeVisible();

    const targetVersion = getByRole('combobox');

    fireEvent.keyDown(targetVersion, DOWN_ARROW);
    await waitForElement(() => getByText(firmware[2].versionName));
    fireEvent.click(getByText(firmware[2].versionName));

    fireEvent.click(getByRole('button', { name: /back/i }));
    expect(
      getByText('Please confirm exiting without saving this Access Point page.')
    ).toBeVisible();

    fireEvent.click(getByRole('button', { name: /cancel/i }));

    fireEvent.keyDown(targetVersion, DOWN_ARROW);
    await waitForElement(() => getByText(firmware[3].versionName));
    fireEvent.click(getByText(firmware[3].versionName));
  });

  it('Confirm leave form Modal should not be visible if form is saved and User clicks back', async () => {
    const { getByRole, getByPlaceholderText, getByText } = render(
      <MemoryRouter initialEntries={['/network/access-points/1/general']}>
        <Route path="/network/access-points/:id/:tab">
          <AccessPointDetails {...defaultProps} />
        </Route>
      </MemoryRouter>
    );

    fireEvent.click(getByRole('tab', { name: /general/i }));

    fireEvent.change(getByPlaceholderText('Enter Access Point Name'), {
      target: { value: 'test-name' },
    });
    fireEvent.click(getByRole('button', { name: /back/i }));

    expect(
      getByText('Please confirm exiting without saving this Access Point page.')
    ).toBeVisible();
    fireEvent.click(getByRole('button', { name: /cancel/i }));
    fireEvent.click(getByRole('button', { name: /save/i }));
    fireEvent.click(getByRole('button', { name: /back/i }));
  });

  it('URL changes to /network/access-points on clicking the back button', () => {
    const history = createMemoryHistory();

    const { getByRole } = render(
      <Router history={history}>
        <AccessPointDetails {...defaultProps} />
      </Router>
    );

    fireEvent.click(getByRole('button', { name: /back/i }));
    expect(window.location.pathname).toEqual('/network/access-points');
  });
});
