import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import {Colors} from 'react-native/Libraries/NewAppScreen';

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

const Hamburger = ({
  onPress,
  menuOpen,
}: {
  onPress(): void;
  menuOpen: boolean;
}) => {
  const translateY = useSharedValue(0);
  const width = useSharedValue(0);
  const angle = useSharedValue('0deg');

  useEffect(() => {
    if (menuOpen) {
      translateY.value = withSpring(3, {damping: 12});
      width.value = withTiming(20, {duration: 300});
      angle.value = withTiming('35deg', {duration: 300});
    } else {
      translateY.value = withSpring(0, {damping: 12});
      width.value = withTiming(40, {duration: 300});
      angle.value = withTiming('0deg', {duration: 300});
    }
  }, [menuOpen]);

  const topLineStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: translateY.value}, {rotateZ: angle.value}],
      width: width.value,
    };
  });
  const bottomLineStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {translateY: -translateY.value},
        {rotateZ: `-${angle.value}`},
      ],
      width: width.value,
    };
  });
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        padding: 10,
        width: 60,
        height: 30,
        position: 'absolute',
        left: 8,
        top: 0,
        zIndex: 1000,
      }}>
      <Animated.View
        style={[
          {
            padding: 2,
            margin: 3,
            backgroundColor: 'black',
            alignSelf: 'flex-end',
          },
          topLineStyle,
        ]}
      />
      <View
        style={{
          padding: 2,
          margin: 3,
          width: 40,
          backgroundColor: 'black',
          alignSelf: 'flex-end',
        }}
      />
      <Animated.View
        style={[
          {
            padding: 2,
            margin: 3,
            backgroundColor: 'black',
            alignSelf: 'flex-end',
            // transform: [{rotateZ: '-42deg'}, {translateX: 3}],
          },
          bottomLineStyle,
        ]}
      />
    </TouchableOpacity>
  );
};

const Button = ({
  title,
  onPress,
  selected,
}: {
  title: string;
  onPress(): void;
  selected: boolean;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        padding: 18,
        paddingLeft: 40,
      }}>
      <Text
        style={{
          fontWeight: '700',
          fontSize: 18,
          opacity: selected ? 0.65 : 0.3,
        }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const CURRENT_CARD_TRANSLATE_X = WIDTH * 0.6;
const INITIAL_CARD_TRANSLATE_X = WIDTH * 0.52;
const Item = ({
  index,
  item,
  selected,
  isOpen,
  onTouch,
}: {
  index: number;
  item: string;
  selected: number;
  isOpen: boolean;
  onTouch: any;
}) => {
  const animateX = useSharedValue(WIDTH);
  const animateY = useSharedValue(0);

  const translateX = INITIAL_CARD_TRANSLATE_X + 10 * index;

  useEffect(() => {
    if (isOpen) {
      if (index > selected) {
        animateX.value = withTiming(WIDTH, {duration: 200});
        animateY.value = withTiming(0, {duration: 100 * (4 - index)});
      } else {
        if (index === selected && animateX.value === 0) {
          animateX.value = withSpring(translateX, {damping: 12});
        } else {
          animateX.value = withTiming(translateX, {
            duration: 200,
          });
        }
        animateY.value = withTiming((selected - index) * 9.5, {
          duration: 100 * (4 - index),
        });
      }
    } else {
      if (index === selected) {
        animateX.value = withTiming(0, {duration: 200});
      }
    }
  }, [isOpen, selected]);

  const animatedStyle = useAnimatedStyle(() => {
    const shadowOpacity = interpolate(
      animateX.value,
      [0, CURRENT_CARD_TRANSLATE_X],
      [0, 0.2],
      Extrapolate.CLAMP,
    );

    const height = interpolate(
      animateX.value,
      [0, translateX],
      [HEIGHT, HEIGHT * 0.8],
      Extrapolate.CLAMP,
    );

    return {
      transform: [{translateX: animateX.value}, {translateY: animateY.value}],
      height,
      shadowOpacity,
    };
  });

  return (
    <Animated.View
      style={[
        {
          height: HEIGHT,
          width: WIDTH,
          backgroundColor: 'white',
          shadowColor: 'grey',
          shadowRadius: 5,
          position: 'absolute',
          justifyContent: 'center',
          zIndex: index + 1,
          padding: 20,
        },
        animatedStyle,
      ]}
      onTouchStart={onTouch}>
      <Text
        style={{
          fontWeight: 'bold',
          fontSize: 40,
          paddingVertical: 20,
        }}>
        {item}
      </Text>
      <View>
        <ScrollView
          horizontal
          contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}
          showsHorizontalScrollIndicator={false}>
          {[1, 2, 3, 4].map(() => (
            <View
              style={{
                height: 160,
                width: 160,
                backgroundColor: Colors.lighter,
                margin: 10,
              }}
            />
          ))}
        </ScrollView>
      </View>
    </Animated.View>
  );
};

const Drawer = () => {
  const [data, setData] = useState(['Work', 'About', 'Blog', 'Contact']);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState('Work');
  const [selectedIndex, setIndex] = useState(0);
  const translateMenuX = useSharedValue(CURRENT_CARD_TRANSLATE_X);

  const menuStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: translateMenuX.value}],
    };
  });

  const animateMenu = function (value: number, duration: number) {
    'worklet';
    translateMenuX.value = withTiming(value, {
      duration: duration,
    });
  };

  const changeMenuState = () => {
    if (isOpen) {
      animateMenu(CURRENT_CARD_TRANSLATE_X, 400);
      setIsOpen(false);
    } else {
      animateMenu(0, 400);
      setIsOpen(true);
    }
  };

  const onMenuSelect = (value: string, index: number) => {
    setSelected(value);
    setIndex(index);
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.lighter,
        justifyContent: 'center',
      }}>
      {data.map((item, index) => (
        <Item
          key={index.toString()}
          index={index}
          item={item}
          selected={selectedIndex}
          isOpen={isOpen}
          onTouch={() => isOpen && setIsOpen(false)}
        />
      ))}

      <Animated.View
        style={[
          {
            position: 'absolute',
            width: WIDTH * 0.4,
            transform: [{translateX: CURRENT_CARD_TRANSLATE_X}],
          },
          menuStyle,
        ]}>
        <Button
          title={'Work'}
          onPress={() => onMenuSelect('Work', 0)}
          selected={selected === 'Work'}
        />
        <Button
          title={'About'}
          onPress={() => onMenuSelect('About', 1)}
          selected={selected === 'About'}
        />
        <Button
          title={'Blog'}
          onPress={() => onMenuSelect('Blog', 2)}
          selected={selected === 'Blog'}
        />
        <Button
          title={'Contact'}
          onPress={() => onMenuSelect('Contact', 3)}
          selected={selected === 'Contact'}
        />
      </Animated.View>

      <Hamburger onPress={changeMenuState} menuOpen={isOpen} />
    </View>
  );
};

export default Drawer;
