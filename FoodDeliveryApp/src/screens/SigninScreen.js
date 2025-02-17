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
import {Separator, ToggleButton} from '../components';
import Feather from 'react-native-vector-icons/Feather';
import {colors, fonts, images} from '../constants';
import {display} from '../utils';
import {AuthenticationService, StorageService} from '../services';
import LottieView from 'lottie-react-native';
import {useDispatch} from 'react-redux';
import {GeneralAction} from '../actions';
import UserService from '../services/UserService';
import {CartAction, BookmarkAction} from '../actions';

const SigninScreen = ({navigation}) => {
  const [isPasswordShow, setPasswordShow] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const dispatch = useDispatch();

  const signIn = async () => {
    setIsLoading(true);
    let user = {
      username,
      password,
    };
    AuthenticationService.login(user).then(response => {
      setIsLoading(false);
      if (response?.status) {
        StorageService.setToken(response?.data).then(() => {
          dispatch(GeneralAction.setToken(response?.data));

          UserService.getUserData().then(userResponse => {
            if (userResponse?.status) {
              dispatch(GeneralAction.setUserData(userResponse?.data));
              dispatch(CartAction.getCartItems());
              dispatch(BookmarkAction.getBookmarks());
            }
          });
        });
      } else {
        setErrorMessage(response?.message);
      }
    });
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
            <View style={styles.logoGroup}>
              <Image
                style={styles.image}
                source={images.LOGO}
                resizeMode="contain"
              />
              <Text style={styles.logoGroupText}>FOOD EXPRESS</Text>
            </View>
          </View>
          <Text style={styles.title}>Let's sign you in</Text>
          <Text style={styles.content}>Welcome back, you've been missed</Text>
          <Separator height={30} />
          <Text style={styles.textOnInput}>Username</Text>
          <View style={styles.inputContainer}>
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
                placeholder="Please enter your username"
                placeholderTextColor={colors.DEFAULT_GREY}
                selectionColor={colors.DEFAULT_GREY}
                style={styles.inputText}
                onChangeText={text => setUsername(text.toLocaleLowerCase())}
              />
            </View>
          </View>
          <Separator height={8} />
          <Text style={styles.textOnInput}>Password</Text>
          <View style={styles.inputContainer}>
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
                placeholder="Please enter your password"
                placeholderTextColor={colors.DEFAULT_GREY}
                selectionColor={colors.DEFAULT_GREY}
                style={styles.inputText}
                onChangeText={text => setPassword(text)}
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
          <View style={styles.forgotPasswordContainer}>
            <View style={styles.toggleContainer}>
              <ToggleButton size={0.5} />
              <Text style={styles.rememberMeText}>Remember me</Text>
            </View>
            <Text
              style={styles.forgotPasswordText}
              onPress={() => navigation.navigate('ForgotPassword')}>
              Forgot password?
            </Text>
          </View>
          <Separator height={10} />
          <TouchableOpacity
            style={styles.signinButton}
            onPress={() => signIn()}>
            {isLoading ? (
              <LottieView source={images.LOADING} autoPlay />
            ) : (
              <Text style={styles.signinButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>
          <View style={styles.signupContainer}>
            <Text style={styles.accountText}>Don't have an account?</Text>
            <Text
              style={styles.signupText}
              onPress={() => navigation.navigate('Signup')}>
              Sign Up
            </Text>
          </View>
          <View style={{flex: 1}} />
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
    marginHorizontal: 20,
    textAlign: 'center',
  },
  content: {
    fontSize: 15,
    fontFamily: fonts.POPPINS_MEDIUM,
    color: colors.DARK_GRAYISH_BLUE,
    marginTop: 5,
    marginHorizontal: 20,
    textAlign: 'center',
  },
  textOnInput: {
    fontSize: 14,
    fontFamily: fonts.POPPINS_REGULAR,
    color: colors.DARK_GRAYISH_BLUE,
    opacity: 0.5,
    marginTop: 5,
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
    padding: 0,
    height: display.setHeight(7),
    color: colors.DEFAULT_BLACK,
    flex: 1,
  },
  forgotPasswordContainer: {
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rememberMeText: {
    marginLeft: 10,
    fontSize: 12,
    lineHeight: 12 * 1.4,
    color: colors.DEFAULT_GREY,
    fontFamily: fonts.POPPINS_MEDIUM,
  },
  forgotPasswordText: {
    fontSize: 12,
    lineHeight: 12 * 1.4,
    color: colors.SECONDARY_RED,
    fontFamily: fonts.POPPINS_BOLD,
  },
  signinButton: {
    backgroundColor: colors.SECONDARY_RED,
    borderRadius: 12,
    marginHorizontal: 20,
    height: display.setHeight(6),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  signinButtonText: {
    fontSize: 18,
    lineHeight: 18 * 1.4,
    color: colors.DEFAULT_WHITE,
    fontFamily: fonts.POPPINS_MEDIUM,
  },
  signupContainer: {
    marginHorizontal: 20,
    justifyContent: 'center',
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountText: {
    fontSize: 13,
    lineHeight: 13 * 1.4,
    color: colors.DARK_GRAYISH_BLUE,
    fontFamily: fonts.POPPINS_MEDIUM,
  },
  signupText: {
    fontSize: 13,
    lineHeight: 13 * 1.4,
    color: colors.SECONDARY_RED,
    fontFamily: fonts.POPPINS_MEDIUM,
    marginLeft: 5,
  },
  facebookButton: {
    backgroundColor: colors.FABEBOOK_BLUE,
    paddingVertical: 15,
    marginHorizontal: 20,
    borderRadius: 12,
    marginVertical: 20,
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
  signinButtonLogo: {
    height: 18,
    width: 18,
  },
  signinButtonLogoContainer: {
    backgroundColor: colors.DEFAULT_WHITE,
    padding: 2,
    borderRadius: 3,
    position: 'absolute',
    left: 25,
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
    padding: 2,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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

export default SigninScreen;
