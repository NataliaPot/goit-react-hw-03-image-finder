import { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchImages } from 'Servises/Api';
import ImageGallery from './ImageGallery/ImageGallery';
import SearchBar from './SearchBar/SearchBar';
import Button from './Button/Button';
import Loader from './Loader/Loader';
import Modal from './Modal/Modal';

class App extends Component {
  state = {
    images: [],
    q: '',
    page: 1,
    isShowLoadMore: false,
    loading: false,
    totalHits: 0,
    isFirstPage: true,
    itemsPerPage: null,
    perPage: 12,
    isShowModal: false,
  };

  async componentDidUpdate(_, prevState) {
    if (prevState.q !== this.state.q || prevState.page !== this.state.page) {
      if (prevState.q !== this.state.q) {
        this.setState({ images: [], totalHits: 0, itemsPerPage: null });
      }
      try {
        this.setState({ loading: true });
        const { hits: resultImages, totalHits } = await fetchImages(
          this.state.q,
          this.state.page
        );

        if (resultImages !== undefined && resultImages.length > 0) {
          this.setState(prevState => ({
            images: [...prevState.images, ...resultImages],
            totalHits,
          }));

          const isLastPage = resultImages.length < prevState.itemsPerPage;
          if (prevState.q !== this.state.q) {
            toast.success(`Hooray! We found ${totalHits} images.`);
            this.setState({
              itemsPerPage: resultImages.length,
              isFirstPage: false,
            });
          }
          this.setState({ isShowLoadMore: true });
          if (isLastPage) {
            this.setState({ isShowLoadMore: false });
          }

          if (resultImages.length < this.state.perPage) {
            this.setState({ isShowLoadMore: false });
            toast.warn(
              "We're sorry, but you've reached the end of search results."
            );
          }
        } else {
          this.setState({ totalHits: 0, images: [], itemsPerPage: null });
          toast.warn(
            'Sorry, there are no images matching your search query. Please try again.'
          );
        }
      } catch (error) {
        console.log(error.message);
        this.setState({ isShowLoadMore: false, itemsPerPage: null });
        toast.error('Oops! Something went wrong. Try reloading the page.');
      } finally {
        this.setState({ loading: false });
      }
    }
  }

  handleSubmit = q => {
    if (!q.trim()) {
      toast.error('Please, enter your search query');
      return;
    }
    if (q.trim() === this.state.q.trim()) {
      return;
    }
    this.setState({
      images: [],
      q,
      page: 1,
      totalHits: 0,
      isFirstPage: true,
      isShowLoadMore: false,
      itemsPerPage: null,
    });
  };

  handleLoadMore = () => {
    this.setState(prevState => ({ page: prevState.page + 1 }));
  };

  closeModal = () => {
    this.setState({ isShowModal: false });
  };

  handleClickImage = image => {
    this.setState({ img: image, isShowModal: true });
  };

  render() {
    const { images, isShowLoadMore, loading, isShowModal } = this.state;

    return (
      <>
        <SearchBar onSubmit={this.handleSubmit} />
        <ImageGallery
          images={images}
          handleClickImage={this.handleClickImage}
        />
        {isShowLoadMore && <Button handleLoadMore={this.handleLoadMore} />}
        {loading && <Loader />}
        <ToastContainer autoClose={2500} theme="dark" />
        {isShowModal && (
          <Modal {...this.state.img} closeModal={this.closeModal} />
        )}
      </>
    );
  }
}

export default App;
