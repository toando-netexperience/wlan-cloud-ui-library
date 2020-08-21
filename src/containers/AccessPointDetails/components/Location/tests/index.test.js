import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, cleanup, waitForElement, waitFor } from '@testing-library/react';
import { render } from 'tests/utils';
import { defaultProps } from '../../../tests/constants';
import Location from '..';

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

describe('<Location />', () => {
  afterEach(() => {
    cleanup();
  });

  it('handleSubmit should  be called on location tab with floor as new locationID', async () => {
    const submitSpy = jest.fn();
    const { getByRole, getByLabelText, getByText } = render(
      <Location {...defaultProps} handleOnEquipmentSave={submitSpy} />
    );

    const city = getByLabelText('City');
    fireEvent.keyDown(city, DOWN_ARROW);
    await waitForElement(() => getByText('Menlo Park'));
    fireEvent.click(getByText('Menlo Park'));

    const building = getByLabelText('Building');
    fireEvent.keyDown(building, DOWN_ARROW);
    await waitForElement(() => getByText('Building 1'));
    fireEvent.click(getByText('Building 1'));

    const floor = getByLabelText('Floor');
    fireEvent.keyDown(floor, DOWN_ARROW);
    await waitForElement(() => getByText('Floor 2'));
    fireEvent.click(getByText('Floor 2'));

    fireEvent.click(getByRole('button', { name: 'Save' }));

    await waitFor(() => {
      expect(submitSpy).toHaveBeenCalledTimes(1);
    });
  });

  it('handleSubmit should  be called on location tab with building as new locationID', async () => {
    const submitSpy = jest.fn();
    const { getByRole, getByLabelText, getByText } = render(
      <Location {...defaultProps} handleOnEquipmentSave={submitSpy} />
    );

    const city = getByLabelText('City');
    fireEvent.keyDown(city, DOWN_ARROW);
    await waitForElement(() => getByText('Menlo Park'));
    fireEvent.click(getByText('Menlo Park'));

    const building = getByLabelText('Building');
    fireEvent.keyDown(building, DOWN_ARROW);
    await waitForElement(() => getByText('Building 2'));
    fireEvent.click(getByText('Building 2'));

    fireEvent.click(getByRole('button', { name: 'Save' }));

    await waitFor(() => {
      expect(submitSpy).toHaveBeenCalledTimes(1);
    });
  });

  it('handleSubmit should  be called on location tab with city as new locationID', async () => {
    const submitSpy = jest.fn();
    const { getByRole, getByLabelText, getByText } = render(
      <Location {...defaultProps} handleOnEquipmentSave={submitSpy} />
    );

    const city = getByLabelText('City');
    fireEvent.keyDown(city, DOWN_ARROW);
    await waitForElement(() => getByText('Ottawa'));
    fireEvent.click(getByText('Ottawa'));

    fireEvent.click(getByRole('button', { name: 'Save' }));

    await waitFor(() => {
      expect(submitSpy).toHaveBeenCalledTimes(1);
    });
  });

  it('should work with the list of locations', async () => {
    const submitSpy = jest.fn();
    const data = {
      ...defaultProps,
      data: { locationId: 4 },
      location: [
        {
          children: [
            {
              id: '7',
              value: '7',
              key: '7',
              locationType: 'BUILDING',
              name: 'Building 2',
              parentId: '2',
            },
            {
              id: '3',
              children: [
                { id: '4', key: '4', locationType: 'FLOOR', name: 'Floor 1', parentId: '3' },
                {
                  id: '5',
                  key: '5',
                  locationType: 'FLOOR',
                  name: 'Floor 2',
                  parentId: '3',
                  value: '5',
                },
                {
                  id: '6',
                  key: '6',
                  locationType: 'FLOOR',
                  name: 'Floor 3',
                  parentId: '3',
                  value: '6',
                },
              ],
              value: '3',
              key: '3',
              locationType: 'BUILDING',
              name: 'Building 1',
              parentId: '2',
            },
          ],
          id: '2',
          key: '2',
          locationType: 'SITE',
          name: 'Menlo Park',
          parentId: '0',
        },
      ],
    };
    render(<Location {...data} handleOnEquipmentSave={submitSpy} />);
  });
});
