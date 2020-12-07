import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, cleanup, waitFor, waitForElement } from '@testing-library/react';
import { Form } from 'antd';
import { render } from 'tests/utils';

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

const mockProps = {
  details: {
    accessNetworkType: 'private_network',
    anqpDomainId: 0,
    associatedAccessSsidProfileIds: [],
    connectionCapabilitySet: [
      {
        connectionCapabilitiesIpProtocol: 'TCP',
        connectionCapabilitiesPortNumber: 9000,
        connectionCapabilitiesStatus: 'open',
      },
    ],
    disableDownstreamGroupAddressedForwarding: true,
    emergencyServicesReachable: true,
    enableInterworkingAndHs20: true,
    gasAddr3Behaviour: 'p2pSpecWorkaroundFromRequest',
    hessid: {
      addressAsString: '0a:0b:0c:0d:0e:0f',
    },
    internetConnectivity: true,
    ipAddressTypeAvailability: 'address_type_not_available',
    networkAuthenticationType: 'acceptance_of_terms_and_conditions',
    operatingClass: 0,
    passpointAccessNetworkType: 'private_network',
    passpointOperatorProfileId: 10,
    passpointOsuProviderProfileIds: [20, 21],
    passpointVenueProfileId: 30,
    termsAndConditionsFile: null,
    unauthenticatedEmergencyServiceAccessible: false,
  },
  venueProfiles: [
    {
      id: '30',
      name: 'Venue-Profile',
      profileType: 'passpoint_venue',
      details: {
        model_type: 'PasspointVenueProfile',
        profileType: 'passpoint_venue',
        venueNameSet: [
          {
            asDuple: 'fra:Exemple de lieu',
            defaultDupleSeparator: ':',
            dupleName: 'Exemple de lieu',
            locale: 'fra_CA',
            model_type: 'PasspointVenueName',
            venueUrl: 'http://www.example.com/info-fra',
          },
        ],
        venueTypeAssignment: {
          model_type: 'ProfileVenueTypeAssignment',
          venueDescription: null,
          venueGroupId: 2,
          venueTypeId: 8,
        },
      },
    },
  ],
  operatorProfiles: [
    {
      id: '10',
      name: 'Operator-Profile',
      profileType: 'passpoint_operator',
      details: {
        operatorFriendlyName: [
          {
            asDuple: 'eng:test',
            defaultDupleSeparator: ':',
            dupleIso3Language: 'eng',
            dupleName: 'test',
            locale: 'eng',
            model_type: 'PasspointDuple',
          },
        ],
        serverOnlyAuthenticatedL2EncriptionNetwork: true,
        x509CertificateLocation: '/etc/ca.pem',
      },
    },
  ],
  idProviderProfiles: [
    {
      id: '20',
      name: 'Id-Provider-Profile-1',
      profileType: 'passpoint_osu_id_provider',
      details: {},
    },
    {
      id: '20',
      name: 'Id-Provider-Profile-1',
      profileType: 'passpoint_osu_id_provider',
      details: {},
    },
  ],
};

const DOWN_ARROW = { keyCode: 40 };

describe('<PasspointProfileForm />', () => {
  afterEach(() => {
    cleanup();
  });

  it('Should still work when passpointVenueProfileId is null', async () => {
    const mockDetails = {
      ...mockProps.details,
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
      ...mockProps.details,
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
      ...mockProps.details,
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

  it('should work when termsAndConditionsFile is not null ', async () => {
    const mockDetails = {
      ...mockProps.details,
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
          <PasspointProfileForm {...mockProps} form={form} />
        </Form>
      );
    };
    const { getByTestId, getByText } = render(<PasspointProfileFormComp />);

    const gifFile = new File(['(⌐□_□)'], 'testImg.gif', {
      type: 'image/gif',
    });

    fireEvent.change(getByTestId('termsAndConditionsUpload'), { target: { files: [gifFile] } });
    expect(getByText('You can only upload JPG/PNG file!')).toBeVisible();
  });

  it('uploading a termsAndConditionsFile in png format should add image on screen', () => {
    const PasspointProfileFormComp = () => {
      const [form] = Form.useForm();
      return (
        <Form form={form}>
          <PasspointProfileForm {...mockProps} form={form} />
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
          <PasspointProfileForm {...mockProps} form={form} />
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
          <PasspointProfileForm {...mockProps} form={form} />
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
          <PasspointProfileForm {...mockProps} form={form} />
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
          <PasspointProfileForm {...mockProps} form={form} />
        </Form>
      );
    };
    const { getByRole, getByText, queryByText } = render(<PasspointProfileFormComp />);

    fireEvent.click(getByRole('button', { name: /add/i }));
    expect(getByText('Add Connection Capability')).toBeVisible();
    fireEvent.click(getByRole('button', { name: /cancel/i }));

    await waitFor(() => {
      expect(queryByText('Add Connection Capability')).not.toBeVisible();
    });
  });

  it('delete button of connection capability should remove row', async () => {
    const PasspointProfileFormComp = () => {
      const [form] = Form.useForm();
      return (
        <Form form={form}>
          <PasspointProfileForm {...mockProps} form={form} />
        </Form>
      );
    };
    const { getByRole, getByText, queryByText } = render(<PasspointProfileFormComp />);

    expect(getByText('9000')).toBeVisible();
    fireEvent.click(getByRole('button', { name: /remove/i }));

    await waitFor(() => {
      expect(queryByText('9000')).not.toBeInTheDocument();
    });
  });

  it('submitting connection capability model should add connection capability', async () => {
    const PasspointProfileFormComp = () => {
      const [form] = Form.useForm();
      return (
        <Form form={form}>
          <PasspointProfileForm {...mockProps} form={form} />
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
          <PasspointProfileForm {...mockProps} form={form} />
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
          <PasspointProfileForm {...mockProps} form={form} />
        </Form>
      );
    };
    const { getByLabelText, queryByText } = render(<PasspointProfileFormComp />);

    fireEvent.change(getByLabelText('ANQP Domain ID'), { target: { value: 7000 } });

    await waitFor(() => {
      expect(queryByText('Enter an ANQP Domain ID between 0 and 65535')).not.toBeInTheDocument();
    });
  });
});
