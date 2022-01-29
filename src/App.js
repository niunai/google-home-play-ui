import React, { useState, useEffect } from "react";
import { Container, Form, Button, Spinner, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import setting from "./setting.json";

function App() {
  useEffect(() => {
    document.title = "GoogleHome Play UI";
  }, []);

  const apiServerUrlRef = React.createRef();
  const deviceNameRef = React.createRef();
  const mp3UrlRef = React.createRef();

  const [loading, setLoading] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");

  const mp3Title = (mp3Url) => {
    const url = setting.mp3Urls.find((el) => el.url === mp3Url);
    if (url !== undefined) {
      return url.name;
    } else {
      return mp3Url;
    }
  };

  const handleSelectMp3UrlChange = (event) => {
    mp3UrlRef.current.value = event.currentTarget.value;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    setAlertMsg("");

    const params = new URLSearchParams();
    params.append("deviceName", deviceNameRef.current.value);
    params.append("mp3Url", mp3UrlRef.current.value);
    params.append("mp3Title", mp3Title(mp3UrlRef.current.value));

    fetch(apiServerUrlRef.current.value, {
      method: "POST",
      body: params,
    })
      .then((response) => response.text())
      .then((data) => {
        console.log(data);
        setLoading(false);
        setAlertMsg(data);
      });
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mt-2 mb-2">
          <Form.Label>API Server URL:</Form.Label>
          <Form.Control
            ref={apiServerUrlRef}
            type="text"
            name="apiServerUrl"
            id="apiServerUrl"
            defaultValue={setting.apiServerUrl}
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Google Home:</Form.Label>
          <Form.Select ref={deviceNameRef}>
            {setting.googleHomeDevices.map((item, index) => (
              <option value={item.name} key={index}>
                {item.alias}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>MP3 URL:</Form.Label>
          <Form.Control
            ref={mp3UrlRef}
            type="text"
            name="mp3Url"
            id="mp3Url"
            defaultValue={setting.mp3Urls[0].url}
          />
        </Form.Group>
        <Form.Select onChange={handleSelectMp3UrlChange}>
          {setting.mp3Urls.map((item, index) => (
            <option value={item.url} key={index}>
              {item.name}
            </option>
          ))}
        </Form.Select>
        <Button
          className="mt-2"
          variant="primary"
          type="submit"
          disabled={loading}
        >
          Submit
        </Button>
      </Form>
      {loading && <Spinner className="mt-2" animation="border" />}
      {!loading && (
        <Alert className="mt-2" variant="info">
          {alertMsg}
        </Alert>
      )}
    </Container>
  );
}

export default App;
