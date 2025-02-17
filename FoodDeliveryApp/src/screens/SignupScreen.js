import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import {colors, fonts, images} from '../constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import {Separator} from '../components';
import {display} from '../utils';
import {AuthenticationService} from '../services';
import LottieView from 'lottie-react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

const inputStyle = state => {
  switch (state) {
    case 'valid':
      return {
        ...styles.inputContainer,
        borderWidth: 1,
        borderColor: colors.SECONDARY_GREEN,
      };
    case 'invalid':
      return {
        ...styles.inputContainer,
        borderWidth: 1,
        borderColor: colors.DEFAULT_RED,
      };
    default:
      return styles.inputContainer;
  }
};

const showMarker = state => {
  switch (state) {
    case 'valid':
      return (
        <AntDesign
          name="checkcircleo"
          color={colors.SECONDARY_GREEN}
          size={18}
          style={{marginLeft: 5}}
        />
      );
    case 'invalid':
      return (
        <AntDesign
          name="closecircleo"
          color={colors.DEFAULT_RED}
          size={18}
          style={{marginLeft: 5}}
        />
      );
    default:
      return null;
  }
};

const SignupScreen = ({navigation}) => {
  const [isPasswordShow, setPasswordShow] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [usernameErrorMessage, setUsernameErrorMessage] = useState('');
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [emailState, setEmailState] = useState('default');
  const [usernameState, setUsernameState] = useState('default');
  const [passwordState, setPasswordState] = useState('default');

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    return passwordRegex.test(password);
  };

  const validateUsername = (username) => {
    const usernameRegex = /^[^\s]{4,}$/;
    return usernameRegex.test(username);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s]+@[^\s]+\.[^\s]+$/;
    return emailRegex.test(email);
  };

  const register = () => {

    let user = {
      username,
      email,
      password,
    };
    console.log(user);
    // setIsLoading(true)

    navigation.navigate('RegisterPhone', {user: user});
  };

  const checkPassword = password => {
    if (!validatePassword(password)) {
      setErrorMessage('Password must be at least 6 characters long, containing letters, numbers, and at least 1 uppercase letter, without spaces.');
      setPasswordState('invalid');
      return;
    } else {
      setErrorMessage('');
      setPasswordState('valid');
    }
  };
  
  const checkUserExist = async (type, value) => {
    if (value?.length > 0) {

      value = value.toLowerCase();
      if (type === 'username' && !validateUsername(username)) {
        setUsernameErrorMessage('Username must be at least 4 characters long and without spaces.');
        setUsernameState('invalid');
        return;
      } 
  
      if (type === 'email' && !validateEmail(email)) {
        setEmailErrorMessage('Please enter a valid email address.');
        setEmailState('invalid');
        return;
      } 

      AuthenticationService.checkUserExist(type, value).then(response => {
        if (response?.status) {
          type === 'email' && emailErrorMessage
            ? setEmailErrorMessage('')
            : null;
          type === 'username' && usernameErrorMessage
            ? setUsernameErrorMessage('')
            : null;

          type === 'email' ? setEmailState('valid') : null;
          type === 'username' ? setUsernameState('valid') : null;
        } else {
          type === 'email' ? setEmailErrorMessage(response?.message) : null;
          type === 'username'
            ? setUsernameErrorMessage(response?.message)
            : null;
          type === 'email' ? setEmailState('invalid') : null;
          type === 'username' ? setUsernameState('invalid') : null;
        }
      });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <StatusBar
            barStyle="dark-content"
            backgroundColor={colors.DEFAULT_WHITE}
            translucent
          />
          <Separator height={StatusBar.currentHeight} />
          <View style={styles.headerContainer}>
            <Ionicons
              name="chevron-back-outline"
              size={25}
              onPress={() => navigation.goBack()}
            />
            <View style={styles.logoGroup}>
              <Image
                style={styles.image}
                source={images.LOGO}
                resizeMode="contain"
              />
              <Text style={styles.logoGroupText}>FOOD EXPRESS</Text>
            </View>
          </View>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.content}>
            Enter your email, username, and password.
          </Text>
          <Text style={styles.textOnInput}>Username</Text>
          <View style={inputStyle(usernameState)}>
            <View style={styles.inputSubContainer}>
              <Feather
                name="user"
                size={22}
                color={colors.DEFAULT_GREY}
                style={{marginRight: 10}}
              />
              <TextInput
                multiline={false}
                maxLength={20}
                autoCorrect={false} // Disable auto correction
                autoCapitalize="none" // Disable auto capitalization
                placeholder="Please enter the desired username"
                placeholderTextColor={colors.DEFAULT_GREY}
                selectionColor={colors.DEFAULT_GREY}
                style={styles.inputText}
                onChangeText={text => setUsername(text)}
                onEndEditing={({nativeEvent: {text}}) =>
                  checkUserExist('username', text)
                }
              />
              {showMarker(usernameState)}
            </View>
          </View>
          <Text style={styles.errorMessage}>{usernameErrorMessage}</Text>
          <Text style={styles.textOnInput}>Email</Text>
          <View style={inputStyle(emailState)}>
            <View style={styles.inputSubContainer}>
              <Feather
                name="mail"
                size={22}
                color={colors.DEFAULT_GREY}
                style={{marginRight: 10}}
              />
              <TextInput
                multiline={false}
                maxLength={20}
                autoCorrect={false} // Disable auto correction
                autoCapitalize="none" // Disable auto capitalization
                placeholder="Please enter the email of your preference"
                placeholderTextColor={colors.DEFAULT_GREY}
                selectionColor={colors.DEFAULT_GREY}
                style={styles.inputText}
                onChangeText={text => setEmail(text)}
                onEndEditing={({nativeEvent: {text}}) =>
                  checkUserExist('email', text)
                }
              />
              {showMarker(emailState)}
            </View>
          </View>

          <Text style={styles.errorMessage}>{emailErrorMessage}</Text>
          <Text style={styles.textOnInput}>Password</Text>
          <View style={inputStyle(passwordState)}>
            <View style={styles.inputSubContainer}>
              <Feather
                name="lock"
                size={22}
                color={colors.DEFAULT_GREY}
                style={{marginRight: 10}}
              />
              <TextInput
                multiline={false}
                maxLength={12}
                autoCorrect={false} // Disable auto correction
                autoCapitalize="none" // Disable auto capitalization
                secureTextEntry={isPasswordShow ? false : true}
                placeholder="Please enter the password you want"
                placeholderTextColor={colors.DEFAULT_GREY}
                selectionColor={colors.DEFAULT_GREY}
                style={styles.inputText}
                onChangeText={text => setPassword(text)}
                onEndEditing={({nativeEvent: {text}}) =>
                  checkPassword(text)
                }
              />
              <Feather
                name={isPasswordShow ? 'eye' : 'eye-off'}
                size={20}
                color={colors.DEFAULT_GREY}
                style={{marginRight: 10}}
                onPress={() => setPasswordShow(!isPasswordShow)}
              />
            </View>
          </View>
          <Text style={styles.errorMessage}>{errorMessage}</Text>
          <View style={{flex: 1}} />
          <TouchableOpacity
            style={styles.signinButton}
            onPress={() => register()} //navigation.navigate("RegisterPhone")}
          >
            {isLoading ? (
              <LottieView source={images.LOADING} autoPlay />
            ) : (
              <Text style={styles.signinButtonText}>Create Account</Text>
            )}
          </TouchableOpacity>
          <Text style={styles.orText}> OR </Text>
          <TouchableOpacity style={styles.facebookButton}>
            <View style={styles.socialButtonContainer}>
              <View style={styles.signinButtonLogoContainer}>
                <Image
                  source={images.FACEBOOK}
                  style={styles.signinButtonLogo}
                />
              </View>
              <Text style={styles.socialSigninButtonText}>
                Connect with Facebook
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.googleButton}>
            <View style={styles.socialButtonContainer}>
              <View style={styles.signinButtonLogoContainer}>
                <Image source={images.GOOGLE} style={styles.signinButtonLogo} />
              </View>
              <Text style={styles.socialSigninButtonText}>
                Connect with Google
              </Text>
            </View>
          </TouchableOpacity>
          <Separator height={40} />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.DEFAULT_WHITE,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  logoGroup: {
    flexDirection: 'row',
    marginRight: 'auto',
    marginLeft: 'auto',
  },
  image: {
    height: display.setHeight(15),
    width: display.setWidth(15),
    overflow: 'visible',
    borderRadius: 20,
  },
  logoGroupText: {
    fontSize: 14,
    fontFamily: fonts.POPPINS_MEDIUM,
    color: colors.SECONDARY_RED,
    marginLeft: 8,
    marginRight: 25,
    alignSelf: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: fonts.POPPINS_BOLD,
    lineHeight: 24 * 1.4,
    textAlign: 'center',
  },
  content: {
    fontSize: 15,
    fontFamily: fonts.POPPINS_MEDIUM,
    color: colors.DARK_GRAYISH_BLUE,
    marginTop: 5,
    marginBottom: 20,
    marginHorizontal: 20,
    textAlign: 'center',
  },
  orText: {
    fontSize: 13,
    lineHeight: 13 * 1.4,
    color: colors.DEFAULT_BLACK,
    fontFamily: fonts.POPPINS_MEDIUM,
    marginLeft: 5,
    alignSelf: 'center',
  },
  textOnInput: {
    fontSize: 14,
    fontFamily: fonts.POPPINS_REGULAR,
    color: colors.DARK_GRAYISH_BLUE,
    opacity: 0.5,
    marginBottom: 5,
    marginHorizontal: 20,
  },
  inputContainer: {
    backgroundColor: colors.LIGHT_GREY,
    paddingHorizontal: 10,
    marginHorizontal: 20,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: colors.LIGHT_GREY2,
    justifyContent: 'center',
  },
  inputSubContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputText: {
    fontSize: 14,
    textAlignVertical: 'center',
    height: display.setHeight(7),
    color: colors.DEFAULT_BLACK,
    flex: 1,
  },
  signinButton: {
    backgroundColor: colors.SECONDARY_RED,
    borderRadius: 12,
    marginHorizontal: 20,
    height: display.setHeight(6),
    justifyContent: 'center',
    alignItems: 'center',
  },
  signinButtonText: {
    fontSize: 18,
    lineHeight: 18 * 1.4,
    color: colors.DEFAULT_WHITE,
    fontFamily: fonts.POPPINS_MEDIUM,
  },
  orText: {
    fontSize: 14,
    lineHeight: 14 * 1.4,
    color: colors.DARK_GRAYISH_BLUE,
    fontFamily: fonts.POPPINS_MEDIUM,
    marginLeft: 5,
    alignSelf: 'center',
    marginTop: 10,
  },
  facebookButton: {
    backgroundColor: colors.FABEBOOK_BLUE,
    paddingVertical: 15,
    marginHorizontal: 20,
    borderRadius: 12,
    marginBottom: 10,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleButton: {
    backgroundColor: colors.GOOGLE_BLUE,
    paddingVertical: 15,
    marginHorizontal: 20,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  socialSigninButtonText: {
    color: colors.DEFAULT_WHITE,
    fontSize: 13,
    lineHeight: 13 * 1.4,
    fontFamily: fonts.POPPINS_MEDIUM,
  },
  signinButtonLogoContainer: {
    backgroundColor: colors.DEFAULT_WHITE,
    padding: 2,
    borderRadius: 3,
    position: 'absolute',
    left: 25,
  },
  signinButtonLogo: {
    height: 18,
    width: 18,
  },
  errorMessage: {
    fontSize: 10,
    lineHeight: 10 * 1.4,
    color: colors.DEFAULT_RED,
    fontFamily: fonts.POPPINS_MEDIUM,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
});

export default SignupScreen;
