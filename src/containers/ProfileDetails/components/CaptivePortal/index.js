import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  Form,
  Input,
  Radio,
  Select,
  Tooltip,
  Upload,
  Alert,
  Collapse,
  message,
  List,
} from 'antd';
import { InfoCircleOutlined, QuestionCircleFilled } from '@ant-design/icons';
import Button from 'components/Button';
import styles from '../index.module.scss';

const { Item } = Form;
const { Option } = Select;
const { Panel } = Collapse;
const { TextArea } = Input;

const validateIPv4 = inputString => {
  // allow spaces in place of dots
  const inputStr = inputString.replace(' ', '.');
  // from http://www.regextester.com/22
  if (
    inputStr.match(
      /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gm
    )
  ) {
    // blacklist certain IPs
    const disallowed = ['0.0.0.0', '255.255.255.255', '127.0.0.1', '256.1.1.1'];
    return disallowed.indexOf(inputStr) < 0;
  }
  return false;
};

const formatFile = file => {
  return {
    uid: file.apExportUrl,
    name: file.apExportUrl,
    type: file.fileType,
  };
};

const CaptivePortalForm = ({ details, form, fileUpload }) => {
  const [showTips, setShowTips] = useState(false);

  const [externalSplash, setExternalSplash] = useState(!!details.externalCaptivePortalURL);
  const [isLoginText, setContentText] = useState(false);

  const [logoFileList, setLogoFileList] = useState(
    (details.logoFile && [formatFile(details.logoFile)]) || []
  );
  const [bgFileList, setBgFileList] = useState(
    (details.backgroundFile && [formatFile(details.backgroundFile)]) || []
  );

  const [whitelist, setWhitelist] = useState(details.walledGardenWhitelist || []);
  const [whitelistSearch, setWhitelistSearch] = useState();
  const [whitelistValidation, setWhitelistValidation] = useState({});

  const disableExternalSplashChange = () => {
    form.setFieldsValue({
      authenticationType: 'guest',
    });
    setExternalSplash(false);
  };

  const validateFile = (file, showMessages = false) => {
    const isJpgOrPng =
      file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
    if (!isJpgOrPng) {
      if (showMessages) message.error('You can only upload JPG/PNG file!');
      return false;
    }

    const isValidSize = file.size / 1024 < 400;
    if (!isValidSize) {
      if (showMessages) message.error('Image must smaller than 400KB!');
      return false;
    }

    return true;
  };

  const handleOnChange = (file, fileList) => {
    if (validateFile(file)) {
      let list = [...fileList];

      list = list.slice(-1);
      list = list.map(i => {
        return { ...i, url: i.response && i.response.url };
      });

      return list;
    }
    return false;
  };

  const handleOnChangeLogo = ({ file, fileList }) => {
    if (fileList.length === 0) {
      setLogoFileList([]);
    }
    const list = handleOnChange(file, fileList);
    if (list) setLogoFileList(list);
  };

  const handleOnChangeBg = ({ file, fileList }) => {
    if (fileList.length === 0) {
      setBgFileList([]);
    }
    const list = handleOnChange(file, fileList);
    if (list) setBgFileList(list);
  };

  const handleFileUpload = file => {
    if (validateFile(file, true)) {
      fileUpload(file.name, file);
    }
    return false;
  };

  const validateWhitelist = (_rule, value) => {
    let inputString = value.trim();

    if (inputString.match(/[a-z]/i)) {
      // contains letters, so validate as hostname

      // remove all spaces
      inputString = inputString.replace(' ', '');

      const hostnameParts = inputString.split('.').reverse();

      // hostname must contain at least two parts (e.g. google.com)
      if (hostnameParts.length < 2) {
        return Promise.reject(
          new Error('Hostnames must have at least 1 subdomain label. e.g. mycompany.com')
        );
      }

      // hostname labels must be between 1 and 63 characters
      let isValidLabelLengths = true;
      hostnameParts.some(part => {
        if (part.length < 1 || part.length > 63) {
          isValidLabelLengths = false;
          return true;
        }
        return false;
      });
      if (!isValidLabelLengths) {
        return Promise.reject(
          new Error('Hostname labels must be between 1 and 63 characters long.')
        );
      }

      // second-level domain cannot be a wildcard
      if (hostnameParts[1].indexOf('*') >= 0) {
        return Promise.reject(
          new Error('Second-level domain labels may not contain a * wildcard.')
        );
      }

      // the * wildcard cannot be combined with any other characters
      if (inputString.indexOf('*')) {
        let isValid = true;
        hostnameParts.some(part => {
          if (part.indexOf('*') >= 0 && part !== '*') {
            isValid = false;
            return true;
          }
          return false;
        });
        if (!isValid) {
          return Promise.reject(
            new Error(
              'The * wildcard may not be combined with other characters in a hostname label.'
            )
          );
        }
      }

      // validate the hostname format & characters
      if (
        !inputString.match(
          /^((\*\.)|([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9])\.)*(\*|[A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9-]*[A-Za-z0-9])$/gm
        )
      ) {
        return Promise.reject(new Error('Unrecognized hostname, IPv4 address, or IP range.'));
      }

      // overall hostname length must be <= 253 characters
      if (inputString.length > 253) {
        return Promise.reject(new Error('Hostnames may not exceed 253 characters in length.'));
      }
    } else {
      const ipAddrs = inputString.split('-');
      if (ipAddrs.length === 2) {
        // validate as IP Range
        ipAddrs[0] = ipAddrs[0].trim();
        ipAddrs[1] = ipAddrs[1].trim();
        if (!validateIPv4(ipAddrs[0]) || !validateIPv4(ipAddrs[1])) {
          return Promise.reject(new Error('Unrecognized hostname, IPv4 address, or IP range.'));
        }
      } else if (!validateIPv4(inputString)) {
        return Promise.reject(new Error('Unrecognized hostname, IPv4 address, or IP range.'));
      }
    }

    // limit whitelist to 32 items
    if (whitelist.length >= 32) {
      return Promise.reject(new Error('Unable to add more than 32 items to the whitelist.'));
    }

    // limit whitelist to 2000 characters
    if (whitelist.join(' ').length > 2000) {
      return Promise.reject(
        new Error('Unable to exceed 2,000 characters for all combined whitelist items.')
      );
    }

    // prevent duplicate items
    if (whitelist.indexOf(inputString) >= 0) {
      return Promise.reject(new Error('This item already exists in the whitelist.'));
    }

    return Promise.resolve();
  };

  const handleOnWhitelist = value => {
    validateWhitelist(null, value).then(() => {
      setWhitelist([...whitelist, value.trim()]);
      setWhitelistSearch('');
      setWhitelistValidation({
        status: null,
        help: null,
      });
    });
  };

  const handleOnChangeWhitelist = event => {
    setWhitelistSearch(event.target.value);
    validateWhitelist(null, event.target.value)
      .then(() => {
        setWhitelistValidation({
          status: null,
          help: null,
        });
      })
      .catch(e => {
        setWhitelistValidation({
          status: 'error',
          help: e.message,
        });
      });
  };

  const handleDeleteWhitelist = item => setWhitelist(whitelist.filter(i => i !== item));

  useEffect(() => {
    form.setFieldsValue({
      authenticationType: details.authenticationType,
      sessionTimeoutInMinutes: details.sessionTimeoutInMinutes,
      browserTitle: details.browserTitle,
      headerContent: details.headerContent,
      userAcceptancePolicy: details.userAcceptancePolicy,
      successPageMarkdownText: details.successPageMarkdownText,
      redirectURL: details.redirectURL,
      externalCaptivePortalURL: details.externalCaptivePortalURL,
      externalSplashPage: details.externalCaptivePortalURL ? 'true' : 'false',
      walledGardenWhitelist: details.walledGardenWhitelist || [],
      logoFile: details.logoFile && formatFile(details.logoFile),
      backgroundFile: details.backgroundFile && formatFile(details.backgroundFile),
      backgroundRepeat: details.backgroundRepeat || 'no_repeat',
      backgroundPosition: details.backgroundPosition || 'left_top',
    });
  }, [form, details]);

  useEffect(() => {
    form.setFieldsValue({
      walledGardenWhitelist: whitelist,
    });
  }, [whitelist]);

  return (
    <div className={styles.ProfilePage}>
      <Card title="General Settings ">
        <Item label="Authentication">
          <div className={styles.InlineDiv}>
            <Item
              name="authenticationType"
              rules={[
                {
                  required: true,
                  message: 'Please select an authentication mode',
                },
              ]}
            >
              <Select className={styles.Field} placeholder="Select authentication mode ">
                <Option value="guest">None</Option>
                {externalSplash && <Option value="external">Externally Hosted API</Option>}
              </Select>
            </Item>
          </div>
        </Item>

        <Item
          name="sessionTimeoutInMinutes"
          label="Session Timeout "
          rules={[
            {
              required: true,
              message: 'Session timeout can be a number between 1 and 1440',
            },
            () => ({
              validator(_rule, value) {
                if (!value || value <= 1440) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error('Session timeout can be a number between 1 and 1440')
                );
              },
            }),
          ]}
        >
          <Input
            className={styles.Field}
            placeholder="1-1440"
            type="number"
            min={1}
            max={1440}
            addonBefore={
              <Tooltip title="Timeout range is 1 - 1440 (one day max) ">
                <InfoCircleOutlined />
              </Tooltip>
            }
            addonAfter="Minutes"
          />
        </Item>
        <Item
          name="redirectURL"
          label="Redirect URL"
          rules={[
            {
              type: 'url',
              message: 'Please enter URL in the format http://... or https://...',
            },
          ]}
        >
          <Input className={styles.Field} placeholder="http://... or https://..." />
        </Item>
        <Item label="Splash Page" name="externalSplashPage">
          <Radio.Group>
            <Radio value="false" onChange={disableExternalSplashChange}>
              Access Point Hosted
            </Radio>
            <Radio value="true" onChange={() => setExternalSplash(true)}>
              Externally Hosted
            </Radio>
          </Radio.Group>
        </Item>
      </Card>
      {externalSplash && (
        <Card title="External Splash Page">
          <Item
            name="externalCaptivePortalURL"
            label="URL"
            rules={[
              {
                required: externalSplash,
                type: 'url',
                message: 'Please enter URL in the format http://... or https://...',
              },
            ]}
          >
            <div className={styles.InlineDiv}>
              <Input className={styles.Field} placeholder="http://... or https://..." />
              <Button onClick={() => setShowTips(!showTips)} icon={<QuestionCircleFilled />}>
                {!showTips ? 'Show Splash Page Tips' : 'Hide Splash Page Tips'}
              </Button>
            </div>
          </Item>
          {showTips && (
            <Alert
              className={styles.Field}
              description={
                <ol>
                  <li>
                    Add your external Splash Page URL into the field above. Save your configuration
                    once satisfied.
                  </li>
                  <li>
                    In your external Splash Page code retrieve the URL encoded
                    <code>login_url</code> parameter (this is automatically attached to the URL).
                  </li>
                  <li>
                    Use the URL encoded <code>login_url</code> parameter value as the POST action
                    for a form on the external Splash Page. This form must contain the following
                    fields:
                    <ul>
                      <li>
                        <code>username:</code> username to be authenticated.
                      </li>
                      <li>
                        <code>password:</code> password to be authenticated.
                      </li>
                      <li>
                        <code>a2w_external:</code> set to string &quot;true&quot; always.
                      </li>
                    </ul>
                  </li>
                  <li>
                    On failed authentication attempts, <code>a2w_authenticated</code> is returned
                    with a value of string &quot;false&quot; as a query parameter.
                  </li>
                  <li>
                    Make sure all HTML assets use the External Splash Page domain or are from a
                    whitelisted domain which can be configured below.
                  </li>
                </ol>
              }
            />
          )}
        </Card>
      )}
      <Collapse expandIconPosition="right" defaultActiveKey={['splashcontent']}>
        <Panel header="Splash Page Content" key="splashcontent" forceRender>
          <Item
            name="browserTitle"
            label="Browser Title"
            rules={[
              {
                required: true,
                message: 'Please enter the browser title',
              },
            ]}
          >
            <Input className={styles.Field} placeholder="Browser title" />
          </Item>
          <Item
            name="headerContent"
            label="Page Title"
            rules={[
              {
                message: 'Please enter the page title',
              },
            ]}
          >
            <Input className={styles.Field} placeholder="Page title" />
          </Item>
          <Item label="Body Content">
            <div className={styles.InlineDiv}>
              <Button
                onClick={() => setContentText(false)}
                type={!isLoginText ? 'primary ' : 'ghost'}
              >
                User Acceptance Policy Text
              </Button>
              <Button
                onClick={() => setContentText(true)}
                type={isLoginText ? 'primary ' : 'ghost'}
              >
                Login Success Text
              </Button>
            </div>
            {!isLoginText && (
              <Item name="userAcceptancePolicy">
                <TextArea className={styles.Field} rows={4} />
              </Item>
            )}
            {isLoginText && (
              <Item name="successPageMarkdownText">
                <TextArea className={styles.Field} rows={4} />
              </Item>
            )}
            &nbsp; Markdown and plain text supported.
          </Item>
        </Panel>
      </Collapse>

      <Collapse expandIconPosition="right">
        <Panel header="Splash Page Images" forceRender>
          <Item label="Configure">
            <div className={styles.InlineDiv}>
              <Tooltip title="Max dimensions recommended are: 1000px by 250px with a max file size of 180KB">
                <div className={styles.InlineDiv}>
                  Logo
                  <InfoCircleOutlined style={{ marginLeft: '6px' }} />
                </div>
              </Tooltip>
              <Tooltip title="Max file size of 400KB">
                <div className={styles.InlineDiv}>
                  Background
                  <InfoCircleOutlined style={{ marginLeft: '6px' }} />
                </div>
              </Tooltip>
            </div>

            <div className={styles.InlineDiv}>
              <Item name="logoFile" className={styles.Image}>
                <Upload
                  accept="image/*"
                  fileList={logoFileList}
                  beforeUpload={handleFileUpload}
                  listType="picture-card"
                  onChange={handleOnChangeLogo}
                >
                  Drop an image here, or click to upload. (jpg, jpeg or png)
                </Upload>
              </Item>
              <Item name="backgroundFile" className={styles.Image}>
                <Upload
                  accept="image/*"
                  fileList={bgFileList}
                  beforeUpload={handleFileUpload}
                  listType="picture-card"
                  onChange={handleOnChangeBg}
                >
                  Drop an image here, or click to upload. (jpg, jpeg or png)
                </Upload>
              </Item>
            </div>
          </Item>
          {bgFileList.length > 0 && (
            <Item label="Background Styles">
              <div className={styles.InlineDiv}>
                <Item name="backgroundRepeat">
                  <Select className={styles.Field} placeholder="Select Background Repeat">
                    <Option value="no_repeat">No Repeat</Option>
                    <Option value="repeat">Repeat</Option>
                    <Option value="cover">Cover</Option>
                  </Select>
                </Item>
                <Item name="backgroundPosition">
                  <Select className={styles.Field} placeholder="Select Background Position">
                    <Option value="left_top">Top Left</Option>
                    <Option value="center_top">Top Center</Option>
                    <Option value="right_top">Top Right</Option>
                    <Option value="left_center">Center Left</Option>
                    <Option value="center_center">Center Center</Option>
                    <Option value="right_center">Center Right</Option>
                    <Option value="left_bottom">Bottom Left</Option>
                    <Option value="center_bottom">Bottom Center</Option>
                    <Option value="right_bottom">Bottom Right</Option>
                  </Select>
                </Item>
              </div>
            </Item>
          )}
        </Panel>
      </Collapse>

      <Collapse expandIconPosition="right">
        <Panel header="Whitelist" forceRender>
          <Item
            label="Configure"
            rules={[
              () => ({
                validator: validateWhitelist,
              }),
            ]}
            validateStatus={whitelistValidation.status}
            help={whitelistValidation.help}
          >
            <Input.Search
              placeholder="Hostname, IP, or IP range..."
              enterButton="Add"
              value={whitelistSearch}
              onSearch={handleOnWhitelist}
              onChange={handleOnChangeWhitelist}
            />
          </Item>

          {whitelist.length > 0 && (
            <List
              className={styles.Whitelist}
              itemLayout="horizontal"
              dataSource={whitelist}
              renderItem={item => (
                <List.Item
                  extra={
                    <Button type="danger" onClick={() => handleDeleteWhitelist(item)}>
                      Remove
                    </Button>
                  }
                >
                  <List.Item.Meta title={item} />
                </List.Item>
              )}
            />
          )}

          <Item name="walledGardenWhitelist" hidden>
            <Input />
          </Item>
        </Panel>
      </Collapse>
    </div>
  );
};

CaptivePortalForm.propTypes = {
  form: PropTypes.instanceOf(Object),
  details: PropTypes.instanceOf(Object),
  fileUpload: PropTypes.func,
};

CaptivePortalForm.defaultProps = {
  form: null,
  details: {},
  fileUpload: () => {},
};

export default CaptivePortalForm;