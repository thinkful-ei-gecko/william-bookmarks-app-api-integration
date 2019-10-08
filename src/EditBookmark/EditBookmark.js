import React, { Component } from  'react';
import BookmarksContext from '../BookmarksContext';
import config from '../config'
import '../AddBookmark/AddBookmark.css';

const Required = () => (
  <span className='AddBookmark__required'>*</span>
)

class EditBookmark extends Component {
  static contextType = BookmarksContext;

  state = {
    error: null,
    id: '',
    title: '',
    url: '',
    description: '',
    rating: 1
  };

  componentDidMount() {
    const bookmarkId = this.props.match.params.bookmarkId;
    fetch(config.API_ENDPOINT + `/${bookmarkId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${config.API_KEY}`
      }
    })
      .then(res => {
        if(!res.ok) {
          return Promise.reject('Error, try again')
        }
        return res.json();
      })
      .then(data => {
        this.setState({
          id: data.id,
          title: data.title,
          url: data.url,
          description: data.description,
          rating: data.rating
        })
      })
      .catch(error => {
        console.error(error)
        this.setState({ error })
      })
  }

updateHandler = e => {
  this.setState({
    [e.target.name]: e.target.value
  })
}

handleSubmit = e => {
  e.preventDefault();
  const bookmarkId = this.props.match.params.bookmarkId;
  const { id, title, url, description, rating } = this.state;
  const updatedBookmark = { id, title, url, description, rating };
  fetch(config.API_ENDPOINT + `/${bookmarkId}`, {
    method: 'PATCH',
    body: JSON.stringify(updatedBookmark),
    headers: {
      'content-type': 'application/json',
      'Authorization': `Bearer ${config.API_KEY}`
    }
  })
  .then(res => {
    if(!res.ok) {
      return Promise.reject('Error, try again')
    }
  })
  .then(() => {
    this.context.updateBookmark(updatedBookmark)
    this.props.history.push('/')
  })
}

handleClickCancel = () => {
  this.props.history.push('/')
}

  render() {
    const { error, title, url, description, rating } = this.state;
    return (
      <section className='AddBookmark'>
        <h2>Edit a bookmark</h2>
        <form
          className='AddBookmark__form'
          onSubmit={this.handleSubmit}
        >
          <div className='AddBookmark__error' role='alert'>
            {error && <p>{error.message}</p>}
          </div>
          <div>
            <label htmlFor='title'>
              Title
              {' '}
              <Required />
            </label>
            <input
              type='text'
              name='title'
              id='title'
              value={title}
              onChange={(e) => this.updateHandler(e)}
              placeholder='Great website!'
              required
            />
          </div>
          <div>
            <label htmlFor='url'>
              URL
              {' '}
              <Required />
            </label>
            <input
              type='url'
              name='url'
              id='url'
              value={url}
              onChange={(e) => this.updateHandler(e)}
              placeholder='https://www.great-website.com/'
              required
            />
          </div>
          <div>
            <label htmlFor='description'>
              Description
            </label>
            <textarea
              name='description'
              id='description'
              value={description}
              onChange={(e) => this.updateHandler(e)}
            />
          </div>
          <div>
            <label htmlFor='rating'>
              Rating
              {' '}
              <Required />
            </label>
            <input
              type='number'
              name='rating'
              id='rating'
              value={rating}
              onChange={(e) => this.updateHandler(e)}
              defaultValue='1'
              min='1'
              max='5'
              required
            />
          </div>
          <div className='AddBookmark__buttons'>
            <button type='button' onClick={this.handleClickCancel}>
              Cancel
            </button>
            {' '}
            <button type='submit'>
              Save
            </button>
          </div>
        </form>
      </section>
    );
  }
}

export default EditBookmark;
