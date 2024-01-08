import { ModalWindow, Overlay } from './Modal.styled';

const { Component } = require('react');

class Modal extends Component {
  state = {};

  componentDidMount() {
    window.addEventListener('keydown', this.handlePressESC);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handlePressESC);
  }

  handlePressESC = e => {
    if (e.code === 'Escape') this.props.closeModal();
  };

  handleClickBackdrop = e => {
    if (e.target === e.currentTarget) {
      this.props.closeModal();
    }
  };

  render() {
    const { largeImageURL, tags } = this.props;
    return (
      <Overlay onClick={this.handleClickBackdrop}>
        <ModalWindow>
          <img src={largeImageURL} alt={tags} />
        </ModalWindow>
      </Overlay>
    );
  }
}

export default Modal;
