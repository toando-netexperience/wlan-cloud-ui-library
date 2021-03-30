// test file for passpoint Fom
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, waitFor, waitForElement } from '@testing-library/react';
import { Form } from 'antd';
import { render, DOWN_ARROW } from 'tests/utils';

import { mockPasspoint } from '../../../tests/constants';

import PasspointProfileForm from '..';

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

describe('<PasspointProfileForm />', () => {
  it('Should still work when passpointVenueProfileId is null', async () => {
    const mockDetails = {
      ...mockPasspoint.details,
      details: {
        passpointVenueProfileId: null,
      },
    };

    const PasspointProfileFormComp = () => {
      const [form] = Form.useForm();
      return (
        <Form form={form}>
          <PasspointProfileForm {...mockDetails} form={form} />
        </Form>
      );
    };
    const { getByText } = render(<PasspointProfileFormComp />);

    await waitFor(() => {
      expect(getByText('Select a Venue Profile')).toBeInTheDocument();
    });
  });

  it('Should still work when passpointOperatorProfileId is null', async () => {
    const mockDetails = {
      ...mockPasspoint.details,
      details: {
        passpointOperatorProfileId: null,
      },
    };

    const PasspointProfileFormComp = () => {
      const [form] = Form.useForm();
      return (
        <Form form={form}>
          <PasspointProfileForm {...mockDetails} form={form} />
        </Form>
      );
    };
    const { getByText } = render(<PasspointProfileFormComp />);

    await waitFor(() => {
      expect(getByText('Select an Operator Profile')).toBeInTheDocument();
    });
  });

  it('Should still work when passpointOsuProviderProfileIds is null', async () => {
    const mockDetails = {
      ...mockPasspoint.details,
      details: {
        passpointOsuProviderProfileIds: null,
      },
    };

    const PasspointProfileFormComp = () => {
      const [form] = Form.useForm();
      return (
        <Form form={form}>
          <PasspointProfileForm {...mockDetails} form={form} />
        </Form>
      );
    };
    const { getByText } = render(<PasspointProfileFormComp />);

    await waitFor(() => {
      expect(getByText('Select ID Providers (check to select)')).toBeInTheDocument();
    });
  });

  it('Should still work when osuSsidProfileId is null', async () => {
    const mockDetails = {
      ...mockPasspoint.details,
      details: {
        osuSsidProfileId: null,
      },
    };

    const PasspointProfileFormComp = () => {
      const [form] = Form.useForm();
      return (
        <Form form={form}>
          <PasspointProfileForm {...mockDetails} form={form} />
        </Form>
      );
    };
    const { getByText } = render(<PasspointProfileFormComp />);

    await waitFor(() => {
      expect(getByText('Select an SSID Profile')).toBeInTheDocument();
    });
  });

  it('HESSID Mac Address Pattern error message should appear when field input is incorret', async () => {
    const PasspointProfileFormComp = () => {
      const [form] = Form.useForm();
      return (
        <Form form={form}>
          <PasspointProfileForm {...mockPasspoint} form={form} />
        </Form>
      );
    };
    const { getByLabelText, getByText } = render(<PasspointProfileFormComp />);

    fireEvent.change(getByLabelText('HESSID'), { target: { value: 'test' } });

    await waitFor(() => {
      expect(getByText('Incorrect MAC Address format e.g. 0A:0B:0C:0D:0E:0F'));
    });
  });

  it('should work when termsAndConditionsFile is not null ', async () => {
    const mockDetails = {
      ...mockPasspoint.details,
      details: {
        termsAndConditionsFile: {
          apExportUrl: 'example.com',
          fileType: 'image/jpeg',
        },
      },
    };
    const PasspointProfileFormComp = () => {
      const [form] = Form.useForm();
      return (
        <Form form={form}>
          <PasspointProfileForm {...mockDetails} form={form} />
        </Form>
      );
    };
    render(<PasspointProfileFormComp />);
  });

  it('uploading a termsAndConditionsFile in other then png/jpg should display error message', () => {
    const PasspointProfileFormComp = () => {
      const [form] = Form.useForm();
      return (
        <Form form={form}>
          <PasspointProfileForm {...mockPasspoint} form={form} />
        </Form>
      );
    };
    const { getByTestId, getByText } = render(<PasspointProfileFormComp />);

    const gifFile = new File(['(⌐□_□)'], 'testImg.gif', {
      type: 'image/gif',
    });

    fireEvent.change(getByTestId('termsAndConditionsUpload'), { target: { files: [gifFile] } });
    expect(getByText('You can only upload a JPG/PNG file!')).toBeVisible();
  });

  it('uploading a termsAndConditionsFile in png format should add image on screen', () => {
    const PasspointProfileFormComp = () => {
      const [form] = Form.useForm();
      return (
        <Form form={form}>
          <PasspointProfileForm {...mockPasspoint} form={form} />
        </Form>
      );
    };
    const { getByTestId, getByRole, getByText } = render(<PasspointProfileFormComp />);

    const pngFile = new File(['(⌐□_□)'], 'testImg.png', {
      type: 'image/png',
    });

    fireEvent.change(getByTestId('termsAndConditionsUpload'), { target: { files: [pngFile] } });
    expect(getByText(/testImg\.png/)).toBeInTheDocument();

    fireEvent.click(getByRole('button', { name: /remove file/i }));
  });

  it('uploading a termsAndConditionsFile in jpg format should add image on screen', () => {
    const PasspointProfileFormComp = () => {
      const [form] = Form.useForm();
      return (
        <Form form={form}>
          <PasspointProfileForm {...mockPasspoint} form={form} />
        </Form>
      );
    };
    const { getByTestId, getByText } = render(<PasspointProfileFormComp />);

    const jpgFile = new File(['(⌐□_□)'], 'testImg.jpg', {
      type: 'image/jpg',
    });

    fireEvent.change(getByTestId('termsAndConditionsUpload'), { target: { files: [jpgFile] } });
    expect(getByText(/testImg\.jpg/)).toBeInTheDocument();
  });

  it('deleting uploaded termsAndConditionsFile should remove image from screen', async () => {
    const PasspointProfileFormComp = () => {
      const [form] = Form.useForm();
      return (
        <Form form={form}>
          <PasspointProfileForm {...mockPasspoint} form={form} />
        </Form>
      );
    };
    const { getByTestId, getByRole, getByText, queryByText } = render(<PasspointProfileFormComp />);

    const pngFile = new File(['(⌐□_□)'], 'testImg.png', {
      type: 'image/png',
    });

    fireEvent.change(getByTestId('termsAndConditionsUpload'), { target: { files: [pngFile] } });
    expect(getByText(/testImg\.png/)).toBeInTheDocument();

    fireEvent.click(getByRole('button', { name: /remove file/i }));

    await waitFor(() => {
      expect(queryByText(/testImg\.png/)).not.toBeInTheDocument();
    });
  });

  it('clicking add connection capability buttons should open modal', async () => {
    const PasspointProfileFormComp = () => {
      const [form] = Form.useForm();
      return (
        <Form form={form}>
          <PasspointProfileForm {...mockPasspoint} form={form} />
        </Form>
      );
    };
    const { getByRole, getByText } = render(<PasspointProfileFormComp />);

    fireEvent.click(getByRole('button', { name: /add/i }));

    await waitFor(() => {
      expect(getByText('Add Connection Capability')).toBeVisible();
    });
  });

  it('clicking cancel of connection capability modal should close modal', async () => {
    const PasspointProfileFormComp = () => {
      const [form] = Form.useForm();
      return (
        <Form form={form}>
          <PasspointProfileForm {...mockPasspoint} form={form} />
        </Form>
      );
    };
    const { getByRole, getByText, queryByText } = render(<PasspointProfileFormComp />);

    fireEvent.click(getByRole('button', { name: /add/i }));
    expect(getByText('Add Connection Capability')).toBeVisible();
    fireEvent.click(getByRole('button', { name: /cancel/i }));

    await waitFor(() => {
      expect(queryByText('Add Connection Capability')).not.toBeInTheDocument();
    });
  });

  it('delete button of connection capability should remove row', async () => {
    const PasspointProfileFormComp = () => {
      const [form] = Form.useForm();
      return (
        <Form form={form}>
          <PasspointProfileForm {...mockPasspoint} form={form} />
        </Form>
      );
    };
    const { getByRole, getByText, queryByText } = render(<PasspointProfileFormComp />);

    expect(getByText('9000')).toBeVisible();
    fireEvent.click(getByRole('button', { name: /removeConnection/i }));

    await waitFor(() => {
      expect(queryByText('9000')).not.toBeInTheDocument();
    });
  });

  it('submitting connection capability model should add connection capability', async () => {
    const PasspointProfileFormComp = () => {
      const [form] = Form.useForm();
      return (
        <Form form={form}>
          <PasspointProfileForm {...mockPasspoint} form={form} />
        </Form>
      );
    };
    const { getByRole, getByLabelText, getByText, queryByText } = render(
      <PasspointProfileFormComp />
    );

    fireEvent.click(getByRole('button', { name: /add/i }));
    expect(getByText('Add Connection Capability')).toBeVisible();

    const selectedStatus = getByLabelText('Status');
    const selectedProtocol = getByLabelText('Protocol');

    fireEvent.keyDown(selectedStatus, DOWN_ARROW);
    await waitForElement(() => getByText('Open'));
    fireEvent.click(getByText('Open'));

    fireEvent.keyDown(selectedProtocol, DOWN_ARROW);
    await waitForElement(() => getByText('UDP'));
    fireEvent.click(getByText('UDP'));

    fireEvent.change(getByLabelText('Port', { target: { value: 1000 } }));
    fireEvent.click(getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(queryByText('1000')).not.toBeInTheDocument();
    });
  });

  it('error message of ANQP Domain ID should appear with invalid input', async () => {
    const PasspointProfileFormComp = () => {
      const [form] = Form.useForm();
      return (
        <Form form={form}>
          <PasspointProfileForm {...mockPasspoint} form={form} />
        </Form>
      );
    };
    const { getByLabelText, getByText } = render(<PasspointProfileFormComp />);

    fireEvent.change(getByLabelText('ANQP Domain ID'), { target: { value: -1000 } });

    await waitFor(() => {
      expect(getByText('Enter an ANQP Domain ID between 0 and 65535')).toBeVisible();
    });
  });

  it('error message of ANQP Domain ID should appear with invalid input', async () => {
    const PasspointProfileFormComp = () => {
      const [form] = Form.useForm();
      return (
        <Form form={form}>
          <PasspointProfileForm {...mockPasspoint} form={form} />
        </Form>
      );
    };
    const { getByLabelText, queryByText } = render(<PasspointProfileFormComp />);

    fireEvent.change(getByLabelText('ANQP Domain ID'), { target: { value: 7000 } });

    await waitFor(() => {
      expect(queryByText('Enter an ANQP Domain ID between 0 and 65535')).not.toBeInTheDocument();
    });
  });

  it('on entering invalid value of SSID Profile profile in Wireless Networks (SSIDs) Enabled on This Profile should filter the options', async () => {
    const PasspointProfileFormComp = () => {
      const [form] = Form.useForm();
      return (
        <Form form={form}>
          <PasspointProfileForm {...mockPasspoint} form={form} />
        </Form>
      );
    };

    const { container } = render(<PasspointProfileFormComp />);
    const selectInputFiled = container.querySelector(
      '[data-testid=ssidProfile] > .ant-select-selector span input'
    );
    fireEvent.change(selectInputFiled, { target: { value: 'test' } });
    fireEvent.keyDown(selectInputFiled, { keyCode: 13 });
  });

  it('on entering invalid value of SSID Profile profile in Wireless Networks (SSIDs) Enabled on This Profile should filter the options', async () => {
    const PasspointProfileFormComp = () => {
      const [form] = Form.useForm();
      return (
        <Form form={form}>
          <PasspointProfileForm {...mockPasspoint} form={form} />
        </Form>
      );
    };

    const { container } = render(<PasspointProfileFormComp />);
    const selectInputFiled = container.querySelector(
      '[data-testid=ssidProfile] > .ant-select-selector span input'
    );
    fireEvent.change(selectInputFiled, { target: { value: 'test' } });
    fireEvent.keyDown(selectInputFiled, { keyCode: 13 });
  });

  it('changing SSID Profile profile on Wireless Networks (SSIDs) Enabled on This Profile should update the table', async () => {
    const PasspointProfileFormComp = () => {
      const [form] = Form.useForm();
      return (
        <Form form={form}>
          <PasspointProfileForm {...mockPasspoint} form={form} />
        </Form>
      );
    };

    const { getByRole, getByText, container } = render(<PasspointProfileFormComp />);
    const selectInputFiled = container.querySelector(
      '[data-testid=ssidProfile] > .ant-select-selector span input'
    );
    fireEvent.change(selectInputFiled, { target: { value: 'test' } });
    fireEvent.keyDown(selectInputFiled, { keyCode: 13 });

    const selectInput = container.querySelector('[data-testid=ssidProfile] > .ant-select-selector');
    fireEvent.mouseDown(selectInput);
    fireEvent.keyDown(selectInput, DOWN_ARROW);

    const profileName = mockPasspoint.ssidProfiles[1].name;

    await waitForElement(() => getByText(profileName));
    fireEvent.click(getByText(profileName));

    await waitFor(() => {
      expect(getByRole('cell', { name: profileName })).toBeVisible();
    });
  });

  it('click delete button sould remove item from Wireless Networks (SSIDs) Enabled on This Profile table', async () => {
    const PasspointProfileFormComp = () => {
      const [form] = Form.useForm();
      return (
        <Form form={form}>
          <PasspointProfileForm {...mockPasspoint} form={form} />
        </Form>
      );
    };

    const { getByRole, getByText } = render(<PasspointProfileFormComp />);

    fireEvent.click(getByRole('button', { name: /removeSsid/i }));
    await waitFor(() => {
      expect(getByText('No Data')).toBeVisible();
    });
  });
});
