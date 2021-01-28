import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, cleanup, waitFor } from '@testing-library/react';
import { Form } from 'antd';
import { render } from 'tests/utils';

import Radius from '..';

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

const mockData = {
  details: {
    model_type: 'RadiusProfile',
    primaryRadiusAuthServer: {
      model_type: 'RadiusServer',
      ipAddress: '127.0.0.1',
      secret: 'secret',
      port: 1812,
      timeout: 5,
    },
    secondaryRadiusAuthServer: {
      model_type: 'RadiusServer',
      ipAddress: '127.0.0.1',
      secret: 'secret',
      port: 1812,
      timeout: 5,
    },
    primaryRadiusAccountingServer: {
      model_type: 'RadiusServer',
      ipAddress: '127.0.0.1',
      secret: 'secret',
      port: 1812,
      timeout: 5,
    },
    secondaryRadiusAccountingServer: {
      model_type: 'RadiusServer',
      ipAddress: '127.0.0.1',
      secret: 'secret',
      port: 1812,
      timeout: 5,
    },
    profileType: 'radius',
  },
};

const RadiusForm = () => {
  const [form] = Form.useForm();
  return (
    <Form form={form}>
      <Radius form={form} {...mockData} />
    </Form>
  );
};

describe('<RadiusForm />', () => {
  afterEach(cleanup);

  it('Form should load with the initial inputs for Primary Authentication Server if details object is empty', async () => {
    const EmptyRadiusForm = () => {
      const [form] = Form.useForm();
      return (
        <Form form={form}>
          <Radius form={form} />
        </Form>
      );
    };

    const { getByTestId } = render(<EmptyRadiusForm />);

    await waitFor(() => {
      expect(getByTestId('authenticationIpAddress0')).toBeVisible();
      expect(getByTestId('authenticationSecret0')).toBeVisible();
      expect(getByTestId('authenticationPort0')).toBeVisible();
      expect(getByTestId('authenticationTimeout0')).toBeVisible();
    });
  });

  it('Form should load with the initial inputs for Primary/Secondary Authentication Server and Primary/Secondary Accounting servers', async () => {
    const { getByTestId } = render(<RadiusForm />);

    expect(getByTestId('authenticationIpAddress0')).toBeVisible();
    expect(getByTestId('authenticationIpAddress1')).toBeVisible();
    expect(getByTestId('accountingIpAddress1')).toBeVisible();
    expect(getByTestId('accountingIpAddress1')).toBeVisible();
  });

  it('Add authentication server button should be disabled once 2 server limit is reached', async () => {
    const { getByRole } = render(<RadiusForm />);

    expect(getByRole('button', { name: /add authentication server/i })).toBeDisabled();
  });

  it('Removing secondary authentication server should remove from the form', async () => {
    const { getByTestId } = render(<RadiusForm />);

    const field = getByTestId('authenticationIpAddress1');

    fireEvent.click(getByTestId('authenticationDelete1'));

    await waitFor(() => {
      expect(field).not.toBeInTheDocument();
    });
  });

  it('Should show error message if Authentication Server port is outside range of 1-65535', async () => {
    const { getByTestId, getByText } = render(<RadiusForm />);

    fireEvent.change(getByTestId('authenticationPort0'), {
      target: { value: 65536 },
    });

    await waitFor(() => {
      expect(getByText('Port expected between 1 - 65535')).toBeVisible();
    });
  });

  it('Should show error message if Authentication Server IP Address does not follow form', async () => {
    const { getByTestId, getByText } = render(<RadiusForm />);

    fireEvent.change(getByTestId('authenticationIpAddress0'), {
      target: { value: 123123 },
    });

    await waitFor(() => {
      expect(getByText('Enter in the format [0-255].[0-255].[0-255].[0-255]')).toBeVisible();
    });
  });

  it('Should show error message if Authentication Server timeout is outside range of 1-1440', async () => {
    const { getByTestId, getByText } = render(<RadiusForm />);

    fireEvent.change(getByTestId('authenticationTimeout0'), {
      target: { value: 1441 },
    });

    await waitFor(() => {
      expect(getByText('Session timeout can be a number between 1 and 1440')).toBeVisible();
    });
  });

  it('Should show error message if Accounting Server port is outside range of 1-65535', async () => {
    const { getByTestId, getByText } = render(<RadiusForm />);

    fireEvent.change(getByTestId('accountingPort0'), {
      target: { value: 65536 },
    });

    await waitFor(() => {
      expect(getByText('Port expected between 1 - 65535')).toBeVisible();
    });

    fireEvent.change(getByTestId('accountingPort0'), {
      target: { value: 1812 },
    });
  });

  it('Should show error message if Accounting Server IP Address does not follow form', async () => {
    const { getByTestId, getByText } = render(<RadiusForm />);

    fireEvent.change(getByTestId('accountingIpAddress0'), {
      target: { value: 123123 },
    });

    await waitFor(() => {
      expect(getByText('Enter in the format [0-255].[0-255].[0-255].[0-255]')).toBeVisible();
    });
  });

  it('Should show error message if Accounting Server timeout is outside range of 1-1440', async () => {
    const { getByTestId, getByText } = render(<RadiusForm />);

    fireEvent.change(getByTestId('accountingTimeout0'), {
      target: { value: 1441 },
    });

    await waitFor(() => {
      expect(getByText('Session timeout can be a number between 1 and 1440')).toBeVisible();
    });

    fireEvent.change(getByTestId('accountingTimeout0'), {
      target: { value: 5 },
    });
  });

  it('Deleting an Accounting Server should remove it from the form', async () => {
    const { getByTestId } = render(<RadiusForm />);

    const button = getByTestId('accountingDelete1');
    fireEvent.click(button);
    await waitFor(() => {
      expect(button).not.toBeInTheDocument();
    });
  });

  it('Deleting an Authentication Server should remove it from the form', async () => {
    const { getByTestId } = render(<RadiusForm />);

    const button = getByTestId('authenticationDelete1');
    fireEvent.click(button);
    await waitFor(() => {
      expect(button).not.toBeInTheDocument();
    });
  });
});
