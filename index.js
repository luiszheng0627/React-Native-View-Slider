import React, { Component } from 'react';
import { Dimensions, ScrollView, View } from 'react-native';
import Dots from './dots';

const { width } = Dimensions.get('window');

export default class ViewSlider extends Component {
  constructor() {
    super();
    this.state = {
      slidesCount: 0,
      step: 1,
      autoSlide: false,
    };
  }

  static getDerivedStateFromProps(props, state) {
    let slidesCount = state.slidesCount;
    if (
      props.hasOwnProperty('renderSlides') &&
      props.renderSlides.hasOwnProperty('props') &&
      props.renderSlides.props.hasOwnProperty('children')
    )
      slidesCount = Object.keys(props.renderSlides.props.children).length;
    return {
      slidesCount,
      step: props.hasOwnProperty('step') ? props.step : state.step,
      autoSlide: props.hasOwnProperty('autoSlide')
        ? props.autoSlide
        : state.autoSlide,
    };
  }

  componentDidUpdate(props) {
    if (props.hasOwnProperty('step')) {
      if (props.step !== this.state.step) this.setStep(this.state.step);
    }
  }

  componentDidMount() {
    if (this.props.autoSlide === true && this.scroll.scrollTo) {
      this.startAutoSlide();
    }

    if (this.props.hasOwnProperty('step')) {
      this.setStep(this.props.step);
    }

    if (this.props.hasOwnProperty('slidesCount')) {
      this.props.slidesCount(this.slidesCount);
    }
  }

  startAutoSlide = () => {
    const interval = this.props.slideInterval;

    if (interval < 1000) {
      console.warn('slideInterval time must be at least 1000 milisecond.');
    } else {
      const count = this.slidesCount;
      let step = 1;

      setInterval(() => {
        this.setStep(step + 1);

        if (count === step + 1) {
          step = 0;
        } else {
          step++;
        }
      }, interval);
    }
  };

  setStep = (step = 1) => {
    const scrollToX =
      this.slidesCount * width - (this.slidesCount - (step - 1)) * width;
    setTimeout(() => this.scroll.scrollTo({ x: scrollToX }), 50);
  };

  onScrollCb = (index) => {
    if (this.props.hasOwnProperty('onScroll')) this.props.onScroll(index);
  };

  onMomentumScrollEnd = ({ nativeEvent }) => {
    const index = Math.round(nativeEvent.contentOffset.x / width) + 1;
    this.setState({ step: index }, this.onScrollCb(index));
  };

  render() {
    const {
      dots,
      dotActiveColor,
      dotInactiveColor,
      dotsContainerStyle,
    } = this.props;
    const { step, slidesCount } = this.state;

    return (
      <View style={[{ width, height: this.props.height }, this.props.style]}>
        <ScrollView
          contentContainerStyle={{}}
          horizontal={true}
          pagingEnabled={true}
          ref={(node) => (this.scroll = node)}
          scrollEventThrottle={70}
          onMomentumScrollEnd={this.onMomentumScrollEnd}
          showsHorizontalScrollIndicator={false}
        >
          {this.props.renderSlides}
        </ScrollView>
        {dots && (
          <Dots
            activeColor={dotActiveColor}
            inactiveColor={dotInactiveColor}
            count={slidesCount}
            activeDot={step}
            containerStyle={dotsContainerStyle}
          />
        )}
      </View>
    );
  }
}
