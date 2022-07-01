import Cookies from 'js-cookie'
import { useState } from 'react';

export default function Home() {
  const handleSubmit = async (event) => {
    event.preventDefault()

    let csrfToken = Cookies.get('csrf-token');
    if (!csrfToken) {
      throw new Error('CSRF token not found');
    }

    let tokenHeader;
    if (event.target.sendToken.checked) {
      tokenHeader = { 'x-csrf-token': csrfToken };
    }

    const resp = await fetch('/api/hello', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...tokenHeader,
      },
      body: JSON.stringify({
        name: event.target.name.value,
      })
    })

    console.log(resp)
  }
    return (
    <div style={{ width: '600px', margin: '5rem auto'}}>
      <h1>CSRF Protection at Edge</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Your Name</label>
          <input type="text" id="name" name="name" className="form-control" />
        </div>
        <div className="form-check">
          <input type="checkbox" className="form-check-input" id="sendToken" name="sendToken" />
          <label className="form-check-label" htmlFor="sendToken">Send CSRF Token</label>
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>

      <br></br>
      <b>Open DevTools to see requests</b>
    </div>
  )
}
