#include "main.h"
#include "AppDelegate.h"
#include "CCEGLView.h"

USING_NS_CC;

//打开CONSOLE调试窗口
#define USE_WIN32_CONSOLE

int APIENTRY _tWinMain(HINSTANCE hInstance,
                       HINSTANCE hPrevInstance,
                       LPTSTR    lpCmdLine,
                       int       nCmdShow)
{
    UNREFERENCED_PARAMETER(hPrevInstance);
    UNREFERENCED_PARAMETER(lpCmdLine);

#ifdef USE_WIN32_CONSOLE
	AllocConsole();
	freopen("CONIN$", "r", stdin);
	freopen("CONOUT$", "w", stdout);
	freopen("CONOUT$", "w", stderr);
#endif
    // create the application instance
    AppDelegate app;
    CCEGLView* eglView = CCEGLView::sharedOpenGLView();
	eglView->setViewName("U1 Technology Fight");
	//==================android===================
	//1.666666666666667
	//eglView->setFrameSize(800,480);
	//1.779166666666667
	//eglView->setFrameSize(854,480);
	//1.777777777777778
	//eglView->setFrameSize(960,540);
	//1.6
	//eglView->setFrameSize(1280,800);
	//1.333333333333333
	//eglView->setFrameSize(320,240);
	//==================ios========================
	//1.5
	//eglView->setFrameSize(960, 640);
	//1.775
	eglView->setFrameSize(1136,640);
	//1.567708333333333
	//eglView->setFrameSize(1024,768);
	//eglView->setFrameSize(1920, 1080);
    int ret = CCApplication::sharedApplication()->run();
#ifdef USE_WIN32_CONSOLE
	FreeConsole();
#endif
	return ret;
}
