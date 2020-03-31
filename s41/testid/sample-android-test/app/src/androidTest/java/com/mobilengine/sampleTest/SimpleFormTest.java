package com.mobilengine.sampleTest;

import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;

import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.filters.SdkSuppress;
import androidx.test.uiautomator.By;
import androidx.test.uiautomator.BySelector;
import androidx.test.uiautomator.UiDevice;
import androidx.test.uiautomator.UiObject;
import androidx.test.uiautomator.UiObjectNotFoundException;
import androidx.test.uiautomator.UiScrollable;
import androidx.test.uiautomator.UiSelector;
import androidx.test.uiautomator.Until;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;

import static androidx.test.core.app.ApplicationProvider.getApplicationContext;
import static androidx.test.platform.app.InstrumentationRegistry.getInstrumentation;
import static org.hamcrest.CoreMatchers.notNullValue;
import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertThat;

@RunWith(AndroidJUnit4.class)
@SdkSuppress(minSdkVersion = 18)
public class SimpleFormTest {

    private static final String TESTED_APP_PACKAGE = "com.mobilengine.android";

    private UiDevice mDevice;

    @Before
    public void startMainActivityFromHomeScreen() {
        // Initialize UiDevice instance
        mDevice = UiDevice.getInstance(getInstrumentation());

        // Start from the home screen
        mDevice.pressHome();

        // Wait for launcher
        final String launcherPackage = getLauncherPackageName();
        assertThat(launcherPackage, notNullValue());
        mDevice.wait(Until.hasObject(By.pkg(launcherPackage).depth(0)), 5000);

        // Launch the app
        Context context = getApplicationContext();
        final Intent intent = context.getPackageManager()
                .getLaunchIntentForPackage(TESTED_APP_PACKAGE);
        // Clear out any previous instances
        if (intent == null) {
            throw new RuntimeException("Couldn't find launcher activity in package " + TESTED_APP_PACKAGE);
        }
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK);
        context.startActivity(intent);

        // Wait for the app to appear
        mDevice.wait(Until.hasObject(By.pkg(TESTED_APP_PACKAGE).depth(0)), 5000);
    }

    private UiObject findInScrollable(UiScrollable scrollable, UiSelector selector) throws UiObjectNotFoundException {
        scrollable.scrollIntoView(selector);
        UiObject child = scrollable.getChild(selector);
        scrollable.ensureFullyVisible(child);
        return child;
    }

    @Test
    public void openAndSubmitForm() throws Exception {
        // click "Log in" button
        BySelector logIn = By.desc("logIn");
        mDevice.wait(Until.findObject(logIn), 10000);
        mDevice.findObject(logIn).click();

        // set username, password and log in
        mDevice.wait(Until.findObject(By.desc("username")), 10000);
        mDevice.findObject(By.desc("username")).setText("gandalf");
        mDevice.findObject(By.desc("password")).setText("Vujmag16");
        mDevice.findObject(By.desc("logIn")).click();

        // wait for the sync to start & finish
        mDevice.wait(Until.findObject(By.desc("syncProgressBar")), 20000);
        mDevice.wait(Until.gone(By.desc("syncProgressBar")), 10000);

        // find the form in the menu
        UiScrollable menu = new UiScrollable(new UiSelector().description("menu"));
        UiObject formListItem = findInScrollable(menu, new UiSelector().text("testid_android"));
        formListItem.click();

        // wait for the form to appear
        mDevice.wait(Until.findObject(By.desc("form")), 10000);

        // find the control with testid="westIda"
        UiScrollable form = new UiScrollable(new UiSelector().description("form"));
        UiSelector westIdaSelector = new UiSelector().description("westIda");
        UiObject westIda = findInScrollable(form, westIdaSelector);

        // find the checkbox in the control & check it
        UiObject checkbox = westIda.getChild(new UiSelector().checkable(true));
        checkbox.click();

        // verify the label at the bottom of the form
        form.scrollToEnd(9);
        // this testId is set dynamically when the westIda checkbox is checked
        UiObject labelControl = mDevice.findObject(new UiSelector().description("checked_True"));
        UiObject textView = labelControl.getChild(new UiSelector().textContains("West Ida Checked:"));
        Assert.assertThat(textView.getText(), is("West Ida Checked:True"));

        // submit the form with the footer label
        UiSelector footer = new UiSelector().description("footer");
        mDevice.findObject(footer).click();

        // log out
        UiSelector logOut = new UiSelector().text("Log out");
        menu.scrollIntoView(logOut);
        mDevice.findObject(logOut).click();
    }

    /**
     * Uses package manager to find the package name of the device launcher. Usually this package
     * is "com.android.launcher" but can be different at times. This is a generic solution which
     * works on all platforms.`
     */
    private String getLauncherPackageName() {
        // Create launcher Intent
        final Intent intent = new Intent(Intent.ACTION_MAIN);
        intent.addCategory(Intent.CATEGORY_HOME);

        // Use PackageManager to get the launcher package name
        PackageManager pm = getApplicationContext().getPackageManager();
        ResolveInfo resolveInfo = pm.resolveActivity(intent, PackageManager.MATCH_DEFAULT_ONLY);
        return resolveInfo.activityInfo.packageName;
    }
}
